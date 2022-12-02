import { PrismaClient } from "@prisma/client";

export const createFavorite = ({ userId, postId }: { userId: number; postId: number }, prisma: PrismaClient) => {
    return prisma.favorites.create({
        data: {
            userId,
            postId
        }
    });
};
