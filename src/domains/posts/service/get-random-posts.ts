import { PrismaClient } from "@prisma/client";

export const getRandomPostsService = async ({ userId, postIds }: { userId: number; postIds: number[] }, prisma: PrismaClient) => {
    const posts = await prisma.posts.findMany({
        select: {
            id: true,
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
            },
            scraps: {
                select: {
                    userId: true,
                    postId: true
                },
                where: {
                    userId
                }
            }
        },
        where: {
            id: {
                in: postIds
            },
            isPublic: true,
            deletedAt: null
            // deletedAt: {
            //     not: null
            // }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const parsedPosts = posts.map((post) => {
        const { user, favorites, scraps, ...restPost } = post;
        const { followers, ...restUser } = user;
        const isFollow = post.user.followers.length > 0;
        const isFavorite = post.favorites.length > 0;
        const isScrap = post.scraps.length > 0;

        return {
            isFavorite,
            isFollow,
            isScrap,
            user: restUser,
            ...restPost
        };
    });

    return parsedPosts;
    // return prisma.$transaction([posts]);
};
