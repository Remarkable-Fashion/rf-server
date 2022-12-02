import { PrismaClient } from "@prisma/client";

export const deleteFavorite = ({ userId, postId, favoriteId }: { userId: number; postId: number; favoriteId: number }, prisma: PrismaClient) => {
    return prisma.favorites.delete({
        where: {
            id: favoriteId,
            userId_postId: {
                userId,
                postId
            }
        }
    });
};
