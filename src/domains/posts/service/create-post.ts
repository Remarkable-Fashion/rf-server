import { Clothes, Season, Sex, Style, Tpo, type PrismaClient } from "@prisma/client";
import { postSex } from "../types";
type IfNull<T, Y, N> = T extends null ? Y : N;

type Optionalize<T> = {
  [K in keyof T]: IfNull<T[K], T[K] | undefined, T[K]>;
}
type ClothesWithout = Omit<Clothes, "id" | "postId" | "createdAt">;
type CCC = Optionalize<ClothesWithout>;

export type CreatePostBody = {
    title: string;
    description: string;
    clothes?: CCC[];
    // clothes?: Omit<Clothes, "id" | "postId" | "createdAt">[];
    tpo?: Tpo;
    season?: Season;
    style?: Style;
    isPublic?: boolean;
    sex?: (typeof postSex)[number];
    // sex?: Sex;
};
export type CreatePost = CreatePostBody & { imgUrls: string[]; userId: number };
type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

// type CreatePostReturn = ;
export type CreatePostReturn = PromiseType<ReturnType<typeof createPost>>;
export const createPost = ({ userId, title, description, imgUrls, clothes, tpo, season, style, isPublic, sex }: CreatePost, prisma: PrismaClient) => {
    const isClosthes = clothes && clothes.length > 0;
    return prisma.posts.create({
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
            title: true,
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
                    imageUrl: true,
                    siteUrl: true
                }
            },
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
