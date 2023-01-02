import type { PrismaClient } from "@prisma/client";

export const getUserByEmail = ({ email }: { email: string }, prisma: PrismaClient) => {
    return prisma.users.findUnique({ select: {id:true, email: true, name: true, meta: {select: {role: true}}},where: { email } });
};
