import { PrismaClient } from "@prisma/client";

export const createFavoirteClothesService = (recommendClothesId: number, userId: number, prisma: PrismaClient) => {
    return prisma.favorites.create({
        data: {
            userId,
            recommendClothesId
        }
    });
};
