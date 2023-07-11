import { PrismaClient } from "@prisma/client";

export const createBlockFollowerService = (data: { blockerId: number; blockedId: number }, prisma: PrismaClient) => {
    return prisma.block.create({
        data: {
            blockerId: data.blockerId,
            blockedId: data.blockedId
        }
    });

    // return prisma.follows.delete({
    //     where: {
    //         followerId_followingId: {
    //             followerId: data.followerId,
    //             followingId: data.followingId
    //         }
    //     }
    // })
};
