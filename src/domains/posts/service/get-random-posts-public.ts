import { PrismaClient } from "@prisma/client";

export const getRandomPostsPublicService = ({ postIds }: { postIds: number[] }, prisma: PrismaClient) => {
    const posts = prisma.posts.findMany({
        select: {
            id: true,
            createdAt: true,
            images: {
                select: {
                    url: true
                }
            },
            _count: {
                select: {
                    favorites: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    profile: {
                        select: {
                            avartar: true
                        }
                    }
                }
            }
        },
        where: {
            id: {
                in: postIds
            },
            isPublic: true,
            deletedAt: null
            // deletedAt: {
            //     not: null
            // }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return prisma.$transaction([posts]);
};
