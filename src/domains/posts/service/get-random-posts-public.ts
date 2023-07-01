import { PrismaClient } from "@prisma/client";

export const getRandomPostsPublicService = ({ postIds }: { postIds: number[] }, prisma: PrismaClient) => {

    const posts = prisma.posts.findMany({
        select: {
            id: true,
<<<<<<< HEAD
=======
            createdAt: true,
>>>>>>> 90fca2f (Feature/get post by (#23))
            images: {
                select: {
                    url: true
                }
            },
<<<<<<< HEAD
=======
            _count: {
                select: {
                    favorites: true
                }
            },
>>>>>>> 90fca2f (Feature/get post by (#23))
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
<<<<<<< HEAD
=======
        },
        orderBy: {
            createdAt: "desc"
>>>>>>> 90fca2f (Feature/get post by (#23))
        }
    });

    return prisma.$transaction([posts])
};
