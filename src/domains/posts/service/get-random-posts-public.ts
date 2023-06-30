import { PrismaClient } from "@prisma/client";

export const getRandomPostsPublicService = ({ postIds }: { postIds: number[] }, prisma: PrismaClient) => {

    const posts = prisma.posts.findMany({
        select: {
            id: true,
            images: {
                select: {
                    url: true
                }
            },
            user: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            avartar: true
                        }
                    },
                }
            },
        },
        where: {
            id: {
                in: postIds
            },
            isPublic: true
        }
    });

    return prisma.$transaction([posts])
};
