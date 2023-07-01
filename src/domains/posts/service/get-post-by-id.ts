import { PrismaClient } from "@prisma/client";

export const getPostByIdService = async (data: {id: number, userId: number}, prisma: PrismaClient) => {
    return prisma.posts.findFirstOrThrow({
        select: {
            id: true,
<<<<<<< HEAD
            place: true,
            style: true,
=======
            title: true,
            description: true,
            place: true,
            style: true,
            createdAt: true,
            deletedAt: true,
>>>>>>> 90fca2f (Feature/get post by (#23))
            user: {
                select: {
                    id: true,
                    profile: {
                        select: {
<<<<<<< HEAD
=======
                            id: true,
>>>>>>> 90fca2f (Feature/get post by (#23))
                            avartar: true,
                            height: true,
                            weight: true,
                            introduction: true,
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
<<<<<<< HEAD
=======
                    id: true,
>>>>>>> 90fca2f (Feature/get post by (#23))
                    brand: true,
                    imageUrl: true,
                    // siteUrl: true,
                    category: true,
                    name: true,
                    price: true,
                    color: true,
                    size: true,
                }
            },
            _count: {
                select: {
                    favorites: true
                }
<<<<<<< HEAD
=======
            },
            favorites: {
                select: {
                    userId: true,
                    postId: true,
                },
                where: {
                    userId: data.userId
                }
            },
            scraps: {
                select: {
                    userId: true,
                    postId: true,
                },
                where: {
                    userId: data.userId,
                }
>>>>>>> 90fca2f (Feature/get post by (#23))
            }
        },
        where:{
            id: data.id,
            isPublic: true,
<<<<<<< HEAD
=======
            deletedAt: null
>>>>>>> 90fca2f (Feature/get post by (#23))
        }
    })
}