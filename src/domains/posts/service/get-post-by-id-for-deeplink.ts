import { PrismaClient } from "@prisma/client";
// import { COUNTS_POST_LIKES_PREFIX } from "../../../constants";
// import { RedisClient } from "../../../db/redis";

export const getPostByIdForDeepLinkService = async (data: { id: number; userId?: number }, prisma: PrismaClient) => {
    return prisma.$transaction(async (tx) => {
        const post = await tx.posts.findFirst({
            select: {
                id: true,
                createdAt: true,
                deletedAt: true,
                likeCount: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: {
                                id: true,
                                avartar: true,
                            }
                        },
                        ...(data.userId && {
                            followers: {
                                where: {
                                    // followingId: data.userId
                                    followerId: data.userId
                                }
                            }
                        })
                        
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
                },
                images: {
                    select: {
                        id: true,
                        url: true,
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

        const { user, clothes, favorites, scraps, ...restPost } = post;

        const { followers, ...restUser } = user;

        const isFollow = data.userId ? user.followers!.length > 0 : false;
        const isFavorite = favorites.length > 0;
        const isScrap = scraps.length > 0;

        // const key = `${COUNTS_POST_LIKES_PREFIX}:${post.id}`;
        // const likeCounts = await redis.get(key);

        const parsedPosts = {
            isFollow,
            isFavorite,
            isScrap,
            ...restPost,
            user: restUser,
            clothes,
            _count: {
                favorites: restPost.likeCount
            },
        };

        return parsedPosts;
    });
};
