import { PrismaClient } from "@prisma/client";

export const getPostByIdService = async (data: {id: number, userId: number}, prisma: PrismaClient) => {
    return prisma.posts.findFirstOrThrow({
        select: {
            id: true,
            place: true,
            style: true,
            user: {
                select: {
                    id: true,
                    profile: {
                        select: {
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
            }
        },
        where:{
            id: data.id,
            isPublic: true,
        }
    })
}