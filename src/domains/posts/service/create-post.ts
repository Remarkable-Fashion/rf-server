import { type PrismaClient } from "@prisma/client";
import { Clothes } from "../types";

export const createPost = (
    { userId, title, description, imgUrls, clothes }: { userId: number; title: string; description: string; imgUrls: string[]; clothes?: Clothes[] },
    prisma: PrismaClient
) => {
    const isClosthes = clothes && clothes.length > 0;
    return prisma.posts.create({
        select: {
            id: true,
            userId: true,
            title: true,
            description: true,
            images: true,
            clothes: true
            // ...(isClosthes && { clothes: true })
        },
        data: {
            userId,
            title,
            description,
            images: {
                create: imgUrls.map((url) => ({ url }))
            },
            ...(isClosthes
                ? {
                      clothes: {
                          create: clothes.map((e) => ({ ...e }))
                      }
                  }
                : {})
        }
    });
};
