import { PrismaClient } from "@prisma/client";
import * as redis from "redis";
import { RedisSingleton } from "../../../db/redis";
import { COUNTS_POST_LIKES_PREFIX } from "../../../constants";

export const getPostsByUserIdService = (
    { myId, userId, cursor, take }: { myId: number; userId: number; cursor?: number; take: number },
    prisma: PrismaClient,
    redis: redis.RedisClientType
) => {
    return prisma.$transaction(async (tx) => {
        const countOfPosts = await tx.posts.count({
            where: {
                userId,
                isPublic: true,
                deletedAt: null
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

        const follow = await tx.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: myId,
                    followingId: userId
                }
            }
        });

        const posts = await tx.posts.findMany({
            select: {
                id: true,
                // title: true,
                isPublic: true,
                images: {
                    select: {
                        url: true
                    }
                },
                createdAt: true,
                deletedAt: true,
                scraps: {
                    select: {
                        userId: true,
                        clothesId: true
                    },
                    where: {
                        userId: myId
                    }
                },
                likeCount: true,
                // user: {
                //     select: {
                //         followers: {
                //             select: {
                //                 followerId: true,
                //                 followingId: true
                //             },
                //             where: {
                //                 followerId: userId
                //             }
                //         }
                //     }
                // }
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
                deletedAt: null
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
            posts.map(async (post) => {
                // const key = `${COUNTS_POST_LIKES_PREFIX}:${post.id}`;
                // const likeCounts = await redis.get(key);
                const likeCounts = post.likeCount;
                const isScrap = post.scraps.length > 0;
                // const isFollow = user.followers.length > 0;

                return {
                    _count: {
                        favorites: likeCounts
                    },
                    isScrap,
                    isFollow: !!follow,
                    ...post
                };
            })
        );

        return { posts: postsWithLikes, countOfPosts, lastOfPost };
    });
};
