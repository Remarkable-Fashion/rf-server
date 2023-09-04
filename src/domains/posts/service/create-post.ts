import { Clothes, type PrismaClient } from "@prisma/client";
import { postSex } from "../types";

type NullableKeys<T> = { [k in keyof T]: null extends T[k] ? k : never }[keyof T];

type Obj = { [key: string]: any };

type NonNullableObj<T> = {
    [K in keyof T]: null extends T[K] ? NonNullable<T[K]> : T[K];
};

type NullToOptional<T extends Obj, NK extends NullableKeys<T> = NullableKeys<T>> = Omit<T, NK> & Partial<NonNullableObj<Pick<T, NK>>>;

type ClothesWithout = Omit<Clothes, "id" | "postId" | "userId" | "createdAt">;
export type _Clothes2 = NullToOptional<ClothesWithout>;
// export type _Clothes2 = {
//     category: ClothesWithout["category"];
//     name: string;
//     price?: number;
//     color?: string;
//     size?: string;
//     brand?: string;
//     reason?: string;
//     imageUrl?: string;
//     siteUrl?: string;
//     recommendedClothesId?: number;
// };

export type CreatePostBody = {
    imgUrls: string[];
    title: string;
    description: string;
    clothes?: _Clothes2[];
    // clothes?: _Clothes[];
    // clothes?: Omit<Clothes, "id" | "postId" | "createdAt">[];
    tpos?: number[] | string[];
    seasons?: number[] | string[];
    styles?: number[] | string[];
    // tpos?: Tpo[];
    // seasons?: Season[];
    // styles?: Style[];
    isPublic?: boolean;
    sex?: typeof postSex[number];
    height?: number;
    weight?: number;
    // sex?: Sex;
};
export type CreatePost = CreatePostBody & { userId: number };
type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

// type CreatePostReturn = ;

export const createPost = async (
    { userId, description, height, weight, imgUrls, clothes, tpos, seasons, styles, isPublic, sex }: CreatePost,
    prisma: PrismaClient
) => {
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
            height: true,
            weight: true,
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
        },
        data: {
            userId,
            ...(height && { height }),
            ...(weight && { weight }),
            description,
            ...(tpos && {
                tpos: {
                    createMany: {
                        data: tpos.map((tpo) => ({ tpoId: Number(tpo) }))
                    }
                }
            }),
            ...(seasons && {
                seasons: {
                    createMany: {
                        data: seasons.map((season) => ({ seasonId: Number(season) }))
                    }
                }
            }),
            ...(styles && {
                styles: {
                    createMany: {
                        data: styles.map((style) => ({ stylesId: Number(style) }))
                    }
                }
            }),
            // ...(seasons && { seasons }),
            // ...(styles && { styles }),
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

export type CreatePostReturn = PromiseType<ReturnType<typeof createPost>>;
