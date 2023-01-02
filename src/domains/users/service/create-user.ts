import { Role, type PrismaClient } from "@prisma/client";

export const createUser = (data: { name?: string; email: string }, prisma: PrismaClient) => {
    return prisma.users.create({ 
        data: {
            ...data, 
            meta: {
                create: {role: Role.User}
            }
        },
        select: { 
            id: true, 
            name: true, 
            email: true, 
            meta: {
                select: {
                    role: true,
                }
            }
        } 
    });
};
