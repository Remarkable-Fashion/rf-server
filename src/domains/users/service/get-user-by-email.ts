import type { PrismaClient } from "@prisma/client";

export const getUserByEmail = ({ email }: { email: string }, prisma: PrismaClient) => {
    return prisma.users.findUnique({ where: { email } });
};
