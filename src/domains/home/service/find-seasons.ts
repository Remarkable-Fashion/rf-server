import { PrismaClient } from "@prisma/client";

export const findSeasonsService = (prisma: PrismaClient) => {
    return prisma.seasons.findMany({
        select: {
            season: true
        }
    });
};
