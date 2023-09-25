import { PrismaClient } from "@prisma/client";

export const deleteClothesByIdService = (id: number, prisma: PrismaClient) => {
    return prisma.clothes.update({
        data: {
            deletedAt: new Date()
        },
        where: {
            id,
        }
    })
};
