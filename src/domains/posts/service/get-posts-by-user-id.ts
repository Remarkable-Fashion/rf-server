import { PrismaClient } from "@prisma/client";
import { RedisClient } from "../../../db/redis";
import { COUNTS_POST_LIKES_PREFIX } from "../../../constants";

export const getPostsByUserIdService = ({userId, cursor, take}: { userId: number, cursor?: number, take: number }, prisma: PrismaClient, redis: RedisClient) => {
    return prisma.$transaction(async (tx) => {

        const countOfPosts = await tx.posts.count({
            where: {
                userId,
                isPublic: true,
                deletedAt: null,
            }
        });

        const lastOfPost = await tx.posts.findFirst({
            where: {
                userId,
                isPublic: true,
                deletedAt: null
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        const posts = await tx.posts.findMany({
            select: {
                id: true,
                title: true,
                isPublic: true,
                images: {
                    select: {
                        url: true
                    }
                },
                createdAt: true,
                deletedAt: true,
                // _count: {
                //     select: {
                //         favorites: true
                //     }
                // }
            },
            where: {
                id: {
                    lt: cursor
                },
                userId,
                isPublic: true,
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc"
            },
            take
        });

        /**
         * @TODO 컨트롤러에서 해야할까?
         */
        const postsWithLikes = await Promise.all(
            posts.map( async (post) => {
                const key = `${COUNTS_POST_LIKES_PREFIX}:${post.id}`;
                const likeCounts = await redis.get(key);

                return {
                    _count: {
                        favorites: likeCounts ? Number(likeCounts) : 0
                    },
                    ...post
                }
            })
        );

        return {posts: postsWithLikes, countOfPosts, lastOfPost};
    })
};
