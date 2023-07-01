import { PrismaClient } from "@prisma/client";

export const getMyPostsService = async (data: {id: number, take: number, cursor?: number}, prisma: PrismaClient) => {
    return prisma.posts.findMany({
        select: {
            id: true,
            userId: true,
            title: true,
            isPublic: true,
            images: true
        },
        where: {
            userId: data.id
        },
        orderBy: {
            createdAt: "asc"
            // id: "desc"
        },
        take: data.take,
        ...(data.cursor && {
            cursor: {
                id: data.cursor
            },
            skip: 1
        })
        
    })
}