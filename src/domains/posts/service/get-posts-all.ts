import { PrismaClient } from "@prisma/client";

export const getPostsAllService = async (prisma: PrismaClient) => {
    const posts = await prisma.posts.findMany({
        select: {
            id: true,
            createdAt: true,
            images: {
                select: {
                    id: true,
                    url: true
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
            },
            // title: true,
            description: true,
            clothes: {
                select: {
                    id: true,
                    category: true,
                    brand: true,
                    name: true,
                    price: true,
                    color: true,
                    size: true,
                    imageUrl: true
                    // siteUrl: true
                }
            },
            tpos: {
                select: {
                    tpoId: true
                }
            },
            seasons: true,
            styles: true,
            isPublic: true,
            sex: true
        }
    });

    return posts;
};
