import { PrismaClient } from "@prisma/client";

export const getPostByIdService = async (id: number, prisma: PrismaClient) => {
    return prisma.posts.findUniqueOrThrow({
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            avartar: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    favorites: true
                }
            }
        },
        where:{
            id
        }
    })
}