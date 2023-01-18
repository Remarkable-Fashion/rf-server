import { type PrismaClient } from "@prisma/client";
import { ReqBody } from "../controller/create-post";

type CreatePost = ReqBody & { imgUrls: string[], userId: number }
export const createPost = (
    { userId, title, description, imgUrls, clothes, tpo, season, style, isPublic, sex }: CreatePost,
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
            isPublic: true,
            sex: true
            // ...(isClosthes && { clothes: true })
        },
        data: {
            userId,
            title,
            description,
            ...(tpo && { tpo }),
            ...(season && { season }),
            ...(style && { style }),
            ...(isPublic && { isPublic }),
            ...(sex && { sex }),
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
