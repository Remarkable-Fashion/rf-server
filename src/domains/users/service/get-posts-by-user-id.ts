import { PrismaClient } from "@prisma/client";

export const getPostsByUserIdService = ({userId, cursor, take}: { userId: number, cursor?: number, take: number }, prisma: PrismaClient) => {
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
                _count: {
                    select: {
                        favorites: true
                    }
                }
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

        return {posts, countOfPosts, lastOfPost};
    })
};
