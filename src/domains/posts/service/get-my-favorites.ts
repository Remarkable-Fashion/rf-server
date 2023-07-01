import { PrismaClient } from "@prisma/client";

export const getMyFavoritesService = ({ userId, cursor, take }: { userId: number; cursor: number, take: number }, prisma: PrismaClient) => {

    return prisma.posts.findMany({
        select: {
            id: true,
            isPublic: true,
            title: true,
            description: true,
            user: true,
            createdAt: true,
        },
        where: {
            id: {
                gt: cursor
            },
            favorites: {
                every: {
                    userId
                }
            }
        },
        orderBy: {
            createdAt: "asc"
        },
        take
    });
};
