import { PrismaClient } from "@prisma/client";

export const getRandomPostsService = ({ userId, postIds }: { userId: number; postIds: number[] }, prisma: PrismaClient) => {

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
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    // const countsOfPost = prisma.posts.count({
    //     where: {userId}
    // })

    return prisma.$transaction([posts])
};
