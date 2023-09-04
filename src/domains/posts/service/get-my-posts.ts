import { PrismaClient } from "@prisma/client";

export const getMyPostsService = async (data: { userId: number; take: number; cursor?: number }, prisma: PrismaClient) => {
    return prisma.$transaction(async (tx) => {
        const totalCountsOfPosts = await tx.posts.count({
            where: {
                userId: data.userId,
                deletedAt: null
            }
        });

        const lastMyPost = await tx.posts.findFirst({
            select: {
                id: true
            },
            where: {
                userId: data.userId
            },
            orderBy: {
                createdAt: "asc"
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
                _count: {
                    select: {
                        favorites: true
                    }
                },
                favorites: {
                    select: {
                        userId: true,
                        postId: true
                    }
                    // where: {
                    //     userId: data.userId
                    // }
                },
                scraps: {
                    select: {
                        userId: true,
                        postId: true
                    }
                    // where: {
                    //     userId
                    // }
                }
            },
            where: {
                ...(data.cursor && {
                    id: {
                        lt: data.cursor
                    }
                }),
                // id: {
                //     lte: data.cursor
                // },
                userId: data.userId,
                deletedAt: null
                // AND: {}
            },
            orderBy: [
                // {createdAt: "desc"},
                { id: "desc" } // id가 높을수록 최신이니깐
            ],
            take: data.take
            // ...(data.cursor && {
            //     cursor: {
            //         id: data.cursor
            //     },
            //     skip: 1
            // })
        });

        const parsedPosts = posts.map((post) => {
            const { favorites, scraps, ...restPost } = post;
            const isFavorite = post.favorites.length > 0;
            const isScrap = post.scraps.length > 0;

            return {
                isFavorite,
                isScrap,
                ...restPost
            };
        });

        return {
            totalCountsOfPosts,
            lastMyPost,
            posts: parsedPosts
        };
    });
    // return prisma.$transaction([totalCountsOfPosts, lastMyPost, posts]);
};
