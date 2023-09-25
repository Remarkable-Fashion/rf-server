import { PrismaClient } from "@prisma/client";

export const getRandomPostsPublicService = async ({ postIds }: { postIds: number[] }, prisma: PrismaClient) => {
    const posts = await prisma.posts.findMany({
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
            // isPublic: true,
            // deletedAt: null
            // deletedAt: {
            //     not: null
            // }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const parsedPosts = posts.map((post) => {
        const isFollow = false;
        const isFavorite = false;
        const isScrap = false;
        return {
            isFavorite,
            isFollow,
            isScrap,
            ...post
        };
    });

    return parsedPosts;
};
