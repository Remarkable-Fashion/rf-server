import { Season, Style, Tpo, type PrismaClient } from "@prisma/client";
import { Clothes } from "../types";

export const createPost = (
    { userId, title, description, imgUrls, clothes, tpo, season, style }: { userId: number; title: string; description: string; imgUrls: string[]; clothes?: Clothes[]; tpo?: Tpo; season?: Season; style?: Style },
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
            clothes: true,
            tpo: true,
            season: true,
            style: true,
            // ...(isClosthes && { clothes: true })
        },
        data: {
            userId,
            title,
            description,
            ...(tpo && { tpo }),
            ...(season && { season }),
            ...(style && { style }),
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
