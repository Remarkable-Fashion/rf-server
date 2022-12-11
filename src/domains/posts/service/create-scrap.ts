import { PrismaClient } from "@prisma/client";

export const createScrap = ({ userId, postId }: { userId: number; postId: number }, prisma: PrismaClient) => {
    return prisma.scraps.create({
        data: {
            userId,
            postId
        }
    });
};
