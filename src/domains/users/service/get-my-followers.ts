import { PrismaClient } from "@prisma/client"

export const getMyFollowersService = (data: { userId: number, cursor?: number, take: number } ,prisma: PrismaClient) => {
    const counts = prisma.follows.count({
        where: {
            followingId: data.userId,
        }
    });

    const lastMyFollower = prisma.follows.findFirst({
        select: {
            followerId: true,
        },
        where: {
            followingId: data.userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })
    
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
}