import type { PrismaClient } from "@prisma/client";

export const getUserWithProfileById = ({ id }: { id: number }, prisma: PrismaClient) => {
    return prisma.users.findUnique({ 
        select: {
            id: true,
            name: true,
            profile: {
                select: {
                    avartar: true,
                    height: true,
                    weight: true,
                    sex: true,
                    introduction: true,
                }
            },
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true
                }
            }
        },
        where: { id } 
    });
};
