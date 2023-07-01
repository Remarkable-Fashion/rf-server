import { PrismaClient } from "@prisma/client";

export const getMyPostsService = async (data: {userId: number, take: number, cursor?: number}, prisma: PrismaClient) => {
    const totalCountsOfPosts = prisma.posts.count({
        where: {
            userId: data.userId,
            deletedAt: null
        }
    });

    const lastMyPost = prisma.posts.findFirstOrThrow({
        select: {
            id: true,
        },
        where: {
            userId: data.userId
        },
        orderBy: {
            createdAt: "asc"
        }
    });
    const posts = prisma.posts.findMany({
        select: {
            id: true,
            title: true,
            isPublic: true,
            images: {
                select: {
                    url: true
                }
            },
            createdAt: true,
            deletedAt: true,
            _count: {
                select: {
                    favorites: true,
                }
            }
        },
        where: {
            userId: data.userId,
            deletedAt: null
            // AND: {}
        },
        orderBy: {
            createdAt: "desc"
            // id: "desc"
        },
        take: data.take,
        ...(data.cursor && {
            cursor: {
                id: data.cursor
            },
            skip: 1
        })
        
    });

    return prisma.$transaction([totalCountsOfPosts, lastMyPost, posts]);
}