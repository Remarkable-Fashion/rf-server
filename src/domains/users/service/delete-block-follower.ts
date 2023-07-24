import { PrismaClient } from "@prisma/client";

export const deleteBlockUserService = (data: { blockerId: number; blockedId: number }, prisma: PrismaClient) => {
    return prisma.block.delete({
        where: {
            // eslint-disable-next-line camelcase
            blockerId_blockedId: {
                blockerId: data.blockerId,
                blockedId: data.blockedId
            }
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
