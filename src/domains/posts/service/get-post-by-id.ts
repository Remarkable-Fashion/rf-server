import { PrismaClient } from "@prisma/client";

export const getPostByIdService = async (data: { id: number; userId: number }, prisma: PrismaClient) => {
    return await prisma.$transaction(async (tx) => {
        const post = await tx.posts.findFirst({
            select: {
                id: true,
                title: true,
                description: true,
                place: true,
                styles: true,
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

        if(!post){
            return;
        }

        const {user, clothes, favorites, scraps, ...restPost} = post;

        const {followers, ...restUser} = user;

        const isFollow = user.followers.length > 0;
        const isFavorite = favorites.length > 0;
        const isScrap = scraps.length > 0;

        const parsedPosts = {
            isFollow,
            isFavorite,
            isScrap,
            ...restPost,
            user: restUser,
            clothes,
        };

        return parsedPosts;
    });

    // return prisma.posts.findFirstOrThrow({
    //     select: {
    //         id: true,
    //         title: true,
    //         description: true,
    //         place: true,
    //         style: true,
    //         createdAt: true,
    //         deletedAt: true,
    //         user: {
    //             select: {
    //                 id: true,
    //                 profile: {
    //                     select: {
    //                         id: true,
    //                         avartar: true,
    //                         height: true,
    //                         weight: true,
    //                         introduction: true
    //                     }
    //                 },
    //                 followers: {
    //                     where: {
    //                         // followingId: data.userId
    //                         followerId: data.userId
    //                     }
    //                 }
    //             }
    //         },
    //         clothes: {
    //             select: {
    //                 id: true,
    //                 brand: true,
    //                 imageUrl: true,
    //                 // siteUrl: true,
    //                 category: true,
    //                 name: true,
    //                 price: true,
    //                 color: true,
    //                 size: true
    //             }
    //         },
    //         _count: {
    //             select: {
    //                 favorites: true
    //             }
    //         },
    //         favorites: {
    //             select: {
    //                 userId: true,
    //                 postId: true
    //             },
    //             where: {
    //                 userId: data.userId
    //             }
    //         },
    //         scraps: {
    //             select: {
    //                 userId: true,
    //                 postId: true
    //             },
    //             where: {
    //                 userId: data.userId
    //             }
    //         }
    //     },
    //     where: {
    //         id: data.id,
    //         isPublic: true,
    //         deletedAt: null
    //     }
    // });
};
