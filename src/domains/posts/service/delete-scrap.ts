import { PrismaClient } from "@prisma/client";

export const deleteScrap = ({ userId, postId }: { userId: number; postId: number }, prisma: PrismaClient) => {
    return prisma.scraps.delete({
        where: {
            // id: scrapId,
            // eslint-disable-next-line camelcase
            userId_postId: {
                userId,
                postId
            }
        }
    });
};
