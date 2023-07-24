import { PrismaClient } from "@prisma/client";

export const getPostByIdService = async (data: { id: number; userId: number }, prisma: PrismaClient) => {
    return prisma.$transaction(async (tx) => {
        const post = await tx.posts.findFirst({
            select: {
                id: true,
                title: true,
                description: true,
                place: true,
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

        const { user, clothes, favorites, scraps, styles, ...restPost } = post;

        const { followers, ...restUser } = user;

        const isFollow = user.followers.length > 0;
        const isFavorite = favorites.length > 0;
        const isScrap = scraps.length > 0;
        const parsedStyles = styles.map((style) => {
            return {
                stylesId: style.stylesId,
                text: style.styles.text,
                emoji: style.styles.emoji
            };
        });

        const parsedPosts = {
            isFollow,
            isFavorite,
            isScrap,
            ...restPost,
            styles: parsedStyles,
            user: restUser,
            clothes
        };

        return parsedPosts;
    });
};
