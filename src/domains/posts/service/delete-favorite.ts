import { PrismaClient } from "@prisma/client";

export const deleteFavorite = ({ userId, postId }: { userId: number; postId: number }, prisma: PrismaClient) => {
    return prisma.favorites.delete({
        where: {
            // id: favoriteId,
            // eslint-disable-next-line camelcase
            userId_postId: {
                userId,
                postId
            }
        }
    });
};
