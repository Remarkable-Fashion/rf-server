import { PrismaClient } from "@prisma/client";

export const checkFollowingService = (data: { followerId: number; followingId: number }, prisma: PrismaClient) => {
    return prisma.follows.findUnique({
        where: {
            followerId_followingId: {
                followerId: data.followerId,
                followingId: data.followingId
            }
        }
    });
};
