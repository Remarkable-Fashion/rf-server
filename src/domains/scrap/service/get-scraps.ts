import { PrismaClient } from "@prisma/client";

export const getScraps = ({ userId, cursorId, take }: { userId: number; cursorId?: number; take: number }, prisma: PrismaClient) => {
    return prisma.scraps.findMany({
        select: {
            userId: true,
            postId: true,
            post: true
        },
        where: {
            userId,
            // post: {
            //     isPublic: true,
            // }
        },
        orderBy: {
            createdAt: "desc"
        },
        take,
        ...(cursorId && {
            cursor: {
                id: cursorId
            },
            skip: 1
        })
    });
};
