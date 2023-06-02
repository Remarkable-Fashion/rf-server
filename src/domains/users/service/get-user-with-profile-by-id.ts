import type { PrismaClient } from "@prisma/client";

export const getUserWithProfileById = ({ id }: { id: number }, prisma: PrismaClient) => {
    return prisma.users.findUnique({ 
        select: {
            id: true,
            profile: true
        },
        where: { id } 
    });
};
