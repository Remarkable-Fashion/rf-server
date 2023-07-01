import { PrismaClient } from "@prisma/client";

export const getRandomPostsService = ({ userId, postIds }: { userId: number; postIds: number[] }, prisma: PrismaClient) => {

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
                    followers: {
                        select: {
                            followerId: true,
                            followingId: true,
                        },
                        where: {
                            followerId: userId
                        }
                    }
                }
            },
            favorites: {
                select: {
                    userId: true,
                    postId: true
                },
                where: {
                    userId
                }
            },
            scraps: {
                select: {
                    userId: true,
                    postId: true,
                },
                where: {
                    userId
                }
            }
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

    // const countsOfPost = prisma.posts.count({
    //     where: {userId}
    // })

    return prisma.$transaction([posts])
};
