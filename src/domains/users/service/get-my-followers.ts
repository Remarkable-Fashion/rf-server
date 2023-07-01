import { PrismaClient } from "@prisma/client"

<<<<<<< HEAD
export const getMyFollowersService = (data: { userId: number} ,prisma: PrismaClient) => {
    return prisma.follows.findMany({
        select: {
            follower: true
=======
export const getMyFollowersService = (data: { userId: number, cursor?: number, take: number } ,prisma: PrismaClient) => {
    const counts = prisma.follows.count({
        where: {
            followingId: data.userId,
        }
    });

    const lastMyFollower = prisma.follows.findFirst({
        select: {
            followerId: true,
>>>>>>> 90fca2f (Feature/get post by (#23))
        },
        where: {
            followingId: data.userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })
<<<<<<< HEAD
=======
    
    const followers = prisma.follows.findMany({
        select: {
            follower: {
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
            createdAt: true
        },
        where: {
            ...(data.cursor && {
                followerId: {
                    lt: data.cursor
                }
            }),
            followingId: data.userId
        },
        orderBy: {
            createdAt: "desc"
        },
        take: data.take
    });

    return prisma.$transaction([counts, lastMyFollower, followers]);
>>>>>>> 90fca2f (Feature/get post by (#23))
}