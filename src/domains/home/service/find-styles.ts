import { PrismaClient } from "@prisma/client";

export const findStylesService = (prisma: PrismaClient) => {
    return prisma.styles.findMany({
        select: {
            id: true,
            text: true,
            emoji: true
        }
    });
};
