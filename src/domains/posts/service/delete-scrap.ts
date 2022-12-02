import { PrismaClient } from "@prisma/client";

export const deleteScrap = ({ userId, postId, scrapId }: { userId: number; postId: number; scrapId: number }, prisma: PrismaClient) => {
    return prisma.scraps.delete({
        where: {
            id: scrapId,
            userId_postId: {
                userId,
                postId
            }
        }
    });
};
