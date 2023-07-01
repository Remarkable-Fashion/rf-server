import { PrismaClient } from "@prisma/client"

export const getBlockUsersService = ({userId}: { userId: number} ,prisma: PrismaClient) => {

    return prisma.block.findMany({
        select: {
            blocked: true
        },
        where:{
            blockerId: userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })

    // return prisma.follows.delete({
    //     where: {
    //         followerId_followingId: {
    //             followerId: data.followerId,
    //             followingId: data.followingId
    //         }
    //     }
    // })
}