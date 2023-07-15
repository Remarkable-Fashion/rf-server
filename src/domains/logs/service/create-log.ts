import { PrismaClient } from "@prisma/client";

export const createLogService = ({ message, usersId }: { message: string; usersId: number }, prisma: PrismaClient) => {
    return prisma.logs.create({
        data: {
            usersId,
            message
        }
    });
};
