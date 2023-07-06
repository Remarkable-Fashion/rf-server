import { PrismaClient } from "@prisma/client";

export const getMyFavoritesService = ({ userId, cursor, take }: { userId: number; cursor?: number, take: number }, prisma: PrismaClient) => {
    const totalCountsOfFavorites = prisma.favorites.count({
        where: {
            userId
        }
    });
    
    const lastMyFavorite = prisma.favorites.findFirst({
        where: {
            userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })

     const posts = prisma.favorites.findMany({
        select: {
            id: true,
            createdAt: true,
            post: {
                select: {
                    id: true,
                    title: true,
                    isPublic: true,
                    createdAt: true,
                    deletedAt: true,
                    images: {
                        select: {
                            // id: true,
                            url: true
                        }
                    },
                    _count: {
                        select: {
                            favorites: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    avartar: true,
                                }
                            },
                            followers: {
                                select: {
                                    // followerId: true,
                                    followingId: true,
                                },
                                where: {
                                    followerId: userId
                                }
                            }
                        }
                    },
                    favorites: {
                        select: {
                            // userId: true,
                            postId: true,
                        },
                        where: {
                            userId
                        }
                    }
                },
                
            }
        },
        where: {
            ...(cursor && {
                id: {
                    lt: cursor,
                }
            }),
            // id: {
            //     lt: cursor
            // },
            userId,
            post: {
                deletedAt: null,
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        take
    });

    return prisma.$transaction([totalCountsOfFavorites, lastMyFavorite, posts]);
};
