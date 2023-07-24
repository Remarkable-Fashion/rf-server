import { PrismaClient } from "@prisma/client";

export const deleteFollowingService = (data: { followerId: number; followingId: number }, prisma: PrismaClient) => {
    return prisma.follows.delete({
        where: {
            // eslint-disable-next-line camelcase
            followerId_followingId: {
                followerId: data.followerId,
                followingId: data.followingId
            }
        }
    });
};
