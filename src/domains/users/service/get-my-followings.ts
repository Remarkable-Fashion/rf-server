import { PrismaClient } from "@prisma/client"

export const getMyFollowingsService = (data: { userId: number; cursor?: number, take: number }, prisma: PrismaClient) => {
    const counts = prisma.follows.count({
        where: {
            followerId: data.userId
        }
    });

    const lastOfFollowing = prisma.follows.findFirst({
        select: {
            followingId: true,
        },
        where: {
            followerId: data.userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })

    const followings = prisma.follows.findMany({
        select: {
            following: {
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
            // follower: true
        },
        where: {
            ...(data.cursor && {
                followingId: {
                    lt: data.cursor
                }
            }),
            followerId: data.userId
        },
        orderBy: {
            createdAt: "desc"
        },
        take: data.take
    });

    return prisma.$transaction([counts, lastOfFollowing, followings]);
}