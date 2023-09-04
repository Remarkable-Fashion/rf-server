import { PrismaClient } from "@prisma/client";

export const getScrapsAllService = async ({ userId, cursorId, take }: { userId: number; cursorId?: number; take: number }, prisma: PrismaClient) => {
    const rv = await prisma.$transaction(async (tx) => {
        const totalCountsOfScraps = await tx.scraps.count({
            where: {
                userId
                // NOT: {
                //     postId: null
                // }
                // clothesId: null
            }
        });

        const lastScrap = await tx.scraps.findFirst({
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
                        // title: true,
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
                                name: true,
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
                },
                // clothes: true
                clothes: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        // siteUrl: true,
                        createdAt: true,
                        _count: {
                            select: {
                                favorites: true
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
                        },
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profile: {
                                    select: {
                                        avartar: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where: {
                id: {
                    lt: cursorId
                },
                userId
            },
            orderBy: {
                createdAt: "desc"
            },
            take
        });

        const mergedScraps = scraps.map((scrap) => {
            let isFollow = false;
            let isFavorite = false;
            if (scrap.post) {
                const { post } = scrap;
                const { user, favorites, ...restPost } = post;
                const { followers, ...restUser } = user;

                isFollow = post.user.followers.length > 0;
                isFavorite = post.favorites.length > 0;

                return {
                    type: "post",
                    isFavorite,
                    isFollow,
                    id: scrap.id,
                    createdAt: scrap.createdAt,
                    post: {
                        ...restPost,
                        user: restUser
                    }
                };
            }

            if (scrap.clothes) {
                const { clothes } = scrap;
                const { favorites, ...restClothes } = clothes;
                isFavorite = scrap.clothes.favorites.length > 0;
                return {
                    type: "clothes",
                    isFavorite,
                    isFollow,
                    id: scrap.id,
                    createdAt: scrap.createdAt,
                    clothes: {
                        ...restClothes
                    }
                };
            }
            return undefined;
        });
        return { totalCountsOfScraps, lastScrap, scraps: mergedScraps };
    });

    return rv;
};
