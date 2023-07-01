import { PrismaClient } from "@prisma/client"

export const getMyFollowingsService = (data: { userId: number} ,prisma: PrismaClient) => {
    return prisma.follows.findMany({
        select: {
            following: true
            // follower: true
        },
        where: {
            followerId: data.userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })
}