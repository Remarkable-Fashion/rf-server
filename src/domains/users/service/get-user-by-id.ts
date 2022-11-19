import type { PrismaClient } from "@prisma/client";

export const getUserById = ({ id }: { id: number }, prisma: PrismaClient) => {
    return prisma.users.findUnique({ where: { id } });
};
