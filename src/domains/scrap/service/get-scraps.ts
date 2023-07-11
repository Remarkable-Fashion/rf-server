import { PrismaClient } from "@prisma/client";

export const getScraps = async ({ userId, cursorId, take }: { userId: number; cursorId?: number; take: number }, prisma: PrismaClient) => {

    const rv = await prisma.$transaction(async (tx) => {
        const totalCountsOfScraps = await tx.scraps.count({
            where: {
                userId
            }
        });
    
        const lastScrapedPost = await tx.scraps.findFirst({
            select: {
                postId: true
            },
            where: {
                userId
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        const scraps = await tx.scraps.findMany({
            select: {
                id: true,
                createdAt: true,
                post: {
                    select: {
                        id: true,
                        title: true,
                        isPublic: true,
                        createdAt: true,
                        images: {
                            select: {
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
                                        avartar: true
                                    }
                                },
                                followers: {
                                    select: {
                                        followerId: true,
                                        followingId: true
                                    },
                                    where: {
                                        followerId: userId
                                    }
                                }
                            }
                        },
                        favorites: {
                            select: {
                                userId: true,
                                postId: true
                            },
                            where: {
                                userId
                            }
                        }
                    }
                }
            },
            where: {
                post: {
                    id: {
                        lt: cursorId
                    }
                },
                userId
            },
            orderBy: {
                createdAt: "desc"
            },
            take
        });

        const mergedScraps = scraps.map((scrap) => {
            const isFollow = scrap.post!.user.followers.length > 0;
            const isFavoirte = scrap.post!.favorites.length > 0;
    
            return {
                isFavoirte,
                isFollow,
                ...scrap.post
            };
        });

        return {totalCountsOfScraps, lastScrapedPost, posts: mergedScraps};
        // return [totalCountsOfScraps, lastScrapedPost, mergedScraps];
    });

    return rv;
};

// const totalCountsOfScraps = prisma.scraps.count({
    //     where: {
    //         userId
    //     }
    // });

    // const lastScrapedPost = prisma.scraps.findFirst({
    //     select: {
    //         postId: true
    //     },
    //     where: {
    //         userId
    //     },
    //     orderBy: {
    //         createdAt: "asc"
    //     }
    // });

    
    // return prisma.$transaction([totalCountsOfScraps, lastScrapedPost, scraps]);
