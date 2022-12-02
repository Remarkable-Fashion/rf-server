import { PrismaClient } from "@prisma/client";

export const getScraps = ({ userId, cursorId, take }: { userId: number; cursorId: number; take: number }, prisma: PrismaClient) => {
    return prisma.scraps.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        },
        take,
        cursor: {
            id: cursorId
        }
    });
};
