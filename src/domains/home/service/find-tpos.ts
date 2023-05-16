import { PrismaClient } from "@prisma/client";
export const findTposService = (prisma: PrismaClient) => {
    return prisma.tpos.findMany({})
}