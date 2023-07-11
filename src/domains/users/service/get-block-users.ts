import { PrismaClient } from "@prisma/client";

export const getBlockUsersService = ({ userId, cursor, take }: { userId: number; cursor?: string; take: number }, prisma: PrismaClient) => {
    const counts = prisma.block.count({
        where: {
            blockerId: userId
        }
    });

    const lastMyBlockedUser = prisma.block.findFirst({
        select: {
            blockedId: true,
            createdAt: true
        },
        where: {
            blockerId: userId
        },
        orderBy: {
            createdAt: "asc"
        }
    });

    const blocks = prisma.block.findMany({
        select: {
            blocked: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profile: {
                        select: {
                            avartar: true
                        }
                    }
                    // createdAt: true,
                }
            },
            createdAt: true
        },
        where: {
            // ...(cursor && {
            //     blockedId: {
            //         lt: cursor
            //     }
            // }),
            blockerId: userId,
            ...(cursor && {
                createdAt: {
                    lt: cursor
                }
            })
        },
        orderBy: {
            createdAt: "desc"
        },
        take
    });

    return prisma.$transaction([counts, lastMyBlockedUser, blocks]);

    // return prisma.follows.delete({
    //     where: {
    //         followerId_followingId: {
    //             followerId: data.followerId,
    //             followingId: data.followingId
    //         }
    //     }
    // })
};
