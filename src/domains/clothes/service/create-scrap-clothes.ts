import { PrismaClient } from "@prisma/client";
export const createScrapClothesByIdService = ({ userId, clothesId }: { userId: number; clothesId: number }, prisma: PrismaClient) => {
    return prisma.scraps.create({
        data: {
            userId,
            clothesId
        }
    });
}