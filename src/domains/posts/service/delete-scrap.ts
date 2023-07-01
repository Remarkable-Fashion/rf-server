import { PrismaClient } from "@prisma/client";

export const deleteScrap = ({ userId, postId }: { userId: number; postId: number }, prisma: PrismaClient) => {
    return prisma.scraps.delete({
        where: {
            // id: scrapId,
            userId_postId: {
                userId,
                postId
            }
        }
    });
};
