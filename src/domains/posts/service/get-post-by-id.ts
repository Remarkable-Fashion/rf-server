import { PrismaClient } from "@prisma/client";

export const getPostByIdService = async (data: { id: number; userId: number }, prisma: PrismaClient) => {
    return prisma.posts.findFirstOrThrow({
        select: {
            id: true,
            title: true,
            description: true,
            place: true,
            style: true,
            createdAt: true,
            deletedAt: true,
            user: {
                select: {
                    id: true,
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
};
