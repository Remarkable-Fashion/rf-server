import { PrismaClient } from "@prisma/client"

export const getMyFollowersService = (data: { userId: number} ,prisma: PrismaClient) => {
    return prisma.follows.findMany({
        select: {
            follower: true
        },
        where: {
            followingId: data.userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })
}