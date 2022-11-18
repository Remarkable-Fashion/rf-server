import { type PrismaClient } from "@prisma/client";

export const createUser = (data: { name?: string; email: string }, prisma: PrismaClient) => {
    return prisma.users.create({ data, select: { id: true, name: true, email: true } });
};
