import { PrismaClient } from "@prisma/client";
export const findStylesService = (prisma: PrismaClient) => {
    return prisma.tpos.findMany({})
}