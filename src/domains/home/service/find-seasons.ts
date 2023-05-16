import { PrismaClient } from "@prisma/client";
export const findSeasonsService = (prisma: PrismaClient) => {
    return prisma.tpos.findMany({})
}