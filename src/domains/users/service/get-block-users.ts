import { PrismaClient } from "@prisma/client"

<<<<<<< HEAD
export const getBlockUsersService = ({userId}: { userId: number} ,prisma: PrismaClient) => {

    return prisma.block.findMany({
        select: {
            blocked: true
        },
        where:{
=======
export const getBlockUsersService = ({userId, cursor, take}: { userId: number, cursor?: number, take: number} ,prisma: PrismaClient) => {

    const counts = prisma.block.count({
        where: {
            blockerId: userId,
        }
    });

    const lastMyBlockedUser = prisma.block.findFirst({
        select: {
            blockedId: true,
        },
        where: {
>>>>>>> 90fca2f (Feature/get post by (#23))
            blockerId: userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })

<<<<<<< HEAD
=======
    const blocks = prisma.block.findMany({
        select: {
            blocked: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profile: {
                        select: {
                            avartar: true,
                        }
                    }
                }
            },
            createdAt: true,
        },
        where:{
            ...(cursor && {
                blockedId: {
                    lt: cursor
                }
            }),
            blockerId: userId
        },
        orderBy: {
            createdAt: "desc"
        },
        take
    });

    return prisma.$transaction([counts, lastMyBlockedUser, blocks]);

>>>>>>> 90fca2f (Feature/get post by (#23))
    // return prisma.follows.delete({
    //     where: {
    //         followerId_followingId: {
    //             followerId: data.followerId,
    //             followingId: data.followingId
    //         }
    //     }
    // })
}