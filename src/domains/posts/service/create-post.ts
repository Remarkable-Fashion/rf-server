import { Clothes, type PrismaClient } from "@prisma/client";
import { postSex } from "../types";

type NullableKeys<T> = { [k in keyof T]: null extends T[k] ? k : never }[keyof T];

type Obj = { [key: string]: any };

type NonNullableObj<T> = {
    [K in keyof T]: null extends T[K] ? NonNullable<T[K]> : T[K];
};

type NullToOptional<T extends Obj, NK extends NullableKeys<T> = NullableKeys<T>> = Omit<T, NK> & Partial<NonNullableObj<Pick<T, NK>>>;

type ClothesWithout = Omit<Clothes, "id" | "postId" | "userId" | "createdAt" | "likeCount">;
export type _Clothes = NullToOptional<ClothesWithout>;

export type CreatePostBody = {
    imgUrls: string[];
    description: string;
    clothes?: _Clothes[];
    // tpos?: string[];
    tpos?: number[];
    seasons?: number[] | string[];
    styles?: number[] | string[];
    isPublic?: boolean;
    sex?: typeof postSex[number];
    height?: number;
    weight?: number;
};
export type CreatePost = CreatePostBody & { userId: number };
type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export const createPost = async (
    { userId, description, height, weight, imgUrls, clothes, tpos, seasons, styles, isPublic, sex }: CreatePost,
    prisma: PrismaClient
) => {
    const isClothes = clothes && clothes.length > 0;

    return prisma.$transaction(async (tx) => {
        
        const post = await tx.posts.create({
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
                // ...(tpos && {
                //     tpos: {
                //         createMany: {
                //             data: tpos.map((tpo) => ({ tpoId: Number(tpo) }))
                //         }
                //     }
                // }),
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
                ...(isClothes
                    ? {
                          clothes: {
                              create: clothes.map((e) => ({ ...e, ...(e.sex ? {sex: e.sex}: { sex: sex }) }))
                          }
                      }
                    : {})
            }
        });

        // if(isClothes){
        //     const data = clothes.map((e) => {
        //         // e.sex;
        //         return { 
        //             ...e,
        //             ...(e.sex ? {
        //                 sex: e.sex
        //             }: {
        //                 sex: sex || "Male"
        //             })
        //          };
        //     });
        //     await tx.clothes.create({
        //         data
        //     })
        // }

        if(tpos){
            const data = tpos.map((tpo) => ({ tpoId: Number(tpo), postsId: post.id }));
            await tx.postTpos.createMany({
                data: data
            });
        }

        return post;
    });
};

export type CreatePostReturn = PromiseType<ReturnType<typeof createPost>>;
