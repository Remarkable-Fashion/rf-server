import { PrismaClient } from "@prisma/client";

export const deleteFavoriteClothesService = ({ userId, clothesId }: { userId: number; clothesId: number }, prisma: PrismaClient) => {
    return prisma.favorites.delete({
        where: {
            /* eslint-disable camelcase */
            userId_clothesId: {
                userId,
                clothesId
            }
        }
    });
};
