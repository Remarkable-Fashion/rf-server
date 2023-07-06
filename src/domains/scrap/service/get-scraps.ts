import { PrismaClient } from "@prisma/client";

export const getScraps = ({ userId, cursorId, take }: { userId: number; cursorId?: number; take: number }, prisma: PrismaClient) => {
    const totalCountsOfScraps = prisma.scraps.count(
        {
            where: {
                userId
            }
        }
    );

    const lastScrapedPost = prisma.scraps.findFirst({
        select: {
            postId: true,
        },
        where: {
            userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })

    const scraps = prisma.scraps.findMany({
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
                            favorites: true,
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
                            postId: true,
                        },
                        where: {
                            userId
                        }
                    },
                }
            }
        },
        where: {
            // id: {
            //     lte: cursorId
            // },
            post: {
                id: {
                    lt: cursorId
                }
            },
            userId,
        },
        orderBy: {
            createdAt: "desc"
        },
        take,
        // ...(cursorId && {
        //     cursor: {
        //         id: cursorId
        //     },
        //     // skip: 1
        // }),
        // skip: 1
    });

    const posts = prisma.posts.findMany({
        select: {
            id: true,
            title: true,
            isPublic: true,
            createdAt: true,
            images: {
                select: {
                    url: true,
                }
            },
            _count: {
                select: {
                    favorites: true,
                }
            },
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profile: {
                        select: {
                            avartar: true,
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
                    postId: true,
                },
                where: {
                    userId
                }
            },
            scraps: true
        },
        where: {
            id: {
                lte: cursorId
            },
            scraps: {
                every: {
                    userId: userId
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        take,
        // skip: 1
    })

    // return prisma.$transaction([totalCountsOfScraps, posts]);
    return prisma.$transaction([totalCountsOfScraps, lastScrapedPost, scraps]);
};
