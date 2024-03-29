import { PrismaClient } from "@prisma/client";

export const getPostByIdService = async (data: { id: number; userId: number }, prisma: PrismaClient) => {
    return prisma.$transaction(async (tx) => {
        const post = await tx.posts.findFirst({
            select: {
                id: true,
                sex: true,
                height: true,
                weight: true,
                // title: true,
                description: true,
                // place: true,
                // styles: true,
                styles: {
                    select: {
                        stylesId: true,
                        styles: {
                            select: {
                                text: true,
                                emoji: true
                            }
                        }
                    }
                },
                tpos: {
                    select: {
                        tpoId: true,
                        tpo: {
                            select: {
                                text: true,
                                emoji: true
                            }
                        }
                    }
                },
                seasons: {
                    select: {
                        seasonId: true,
                        season: {
                            select: {
                                text: true,
                                emoji: true
                            }
                        }
                    }
                },
                // seasons: {},
                createdAt: true,
                deletedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: {
                                id: true,
                                avartar: true,
                                height: true,
                                weight: true,
                                introduction: true
                            }
                        },
                        followers: {
                            where: {
                                // followingId: data.userId
                                followerId: data.userId
                            }
                        }
                    }
                },
                clothes: {
                    select: {
                        id: true,
                        brand: true,
                        imageUrl: true,
                        // siteUrl: true,
                        category: true,
                        name: true,
                        price: true,
                        color: true,
                        size: true
                    }
                },
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
                        userId: data.userId
                    }
                },
                scraps: {
                    select: {
                        userId: true,
                        postId: true
                    },
                    where: {
                        userId: data.userId
                    }
                }
            },
            where: {
                id: data.id,
                isPublic: true,
                deletedAt: null
            }
        });

        if (!post) {
            return undefined;
        }

        const { user, clothes, favorites, scraps, styles, tpos, seasons, ...restPost } = post;

        const { followers, ...restUser } = user;

        const isFollow = user.followers.length > 0;
        const isFavorite = favorites.length > 0;
        const isScrap = scraps.length > 0;
        const parsedStyles = styles.map((style) => {
            return {
                id: style.stylesId,
                text: style.styles.text,
                emoji: style.styles.emoji
            };
        });
        const parsedTpos = tpos.map((tpo) => {
            return {
                id: tpo.tpoId,
                text: tpo.tpo.text,
                emoji: tpo.tpo.emoji
            };
        });
        const parsedSeasons = seasons.map((season) => {
            return {
                id: season.seasonId,
                text: season.season.text,
                emoji: season.season.emoji
            };
        });

        const parsedPosts = {
            isFollow,
            isFavorite,
            isScrap,
            ...restPost,
            styles: parsedStyles,
            tpos: parsedTpos,
            seasons: parsedSeasons,
            user: restUser,
            clothes
        };

        return parsedPosts;
    });
};
