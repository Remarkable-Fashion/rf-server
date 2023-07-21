import { Clothes, Season, Sex, Style, Tpo, type PrismaClient } from "@prisma/client";
import { postSex } from "../types";
type IfNull<T, Y, N> = T extends null ? Y : N;

// type Optionalize<T> = {
//   [K in keyof T]: IfNull<T[K], T[K] | undefined, T[K]>;
// }

type ReplaceNullWithUndefined<T> = T extends null ? undefined : T;
type NullToUndefined<T> = {
    [K in keyof T]: T[K] extends (infer U)[] ? ReplaceNullWithUndefined<U>[] : ReplaceNullWithUndefined<T[K]>
};

type ClothesWithout = Omit<Clothes, "id" | "postId" | "userId" | "createdAt">;
export type _Clothes = ClothesWithout;
// export type _Clothes = NullToUndefined<ClothesWithout>;

export type CreatePostBody = {
    title: string;
    description: string;
    clothes?: _Clothes[];
    // clothes?: Omit<Clothes, "id" | "postId" | "createdAt">[];
    tpos?: number[];
    seasons?: number[];
    styles?: number[];
    // tpos?: Tpo[];
    // seasons?: Season[];
    // styles?: Style[];
    isPublic?: boolean;
    sex?: (typeof postSex)[number];
    // sex?: Sex;
};
export type CreatePost = CreatePostBody & { imgUrls: string[]; userId: number };
type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

// type CreatePostReturn = ;
export type CreatePostReturn = PromiseType<ReturnType<typeof createPost>>;
export const createPost = async ({ userId, title, description, imgUrls, clothes, tpos, seasons, styles, isPublic, sex }: CreatePost, prisma: PrismaClient) => {
    const isClosthes = clothes && clothes.length > 0;

    // let tpoIds: {tpoId: number}[] = [];
    // if(tpos && tpos.length > 0) {
    //     const _tpos = await prisma.tpos.findMany({
    //         select: {
    //             id: true,
    //         },
    //         where:{
    //             text: {
    //                 in: tpos
    //             }
    //         }
    //     });
    //     tpoIds = _tpos.map(tpo => ({
    //         tpoId: tpo.id
    //     }));
    // }

    // tpos?.map(tpo => ({tpoId: tpo}));

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
            tpos: true,
            seasons: true,
            styles: true,
            isPublic: true,
            sex: true
        },
        data: {
            userId,
            title,
            description,
            ...(tpos && { 
                tpos: {
                    createMany: {
                        data: tpos.map(tpo => ({tpoId: tpo}))
                    }
                }
            }),
            // ...(tpos && { 
            //     tpos: {
            //         createMany: {
            //             data: {
            //                 tpoId: []
            //             }
            //         }
            //     }
            // }),
            ...(seasons && { 
                seasons: {
                    createMany: {
                        data: seasons.map(season => ({seasonId: season}))
                    }
                }
            }),
            ...(styles && { 
                styles: {
                    createMany: {
                        data: styles.map(style => ({stylesId: style}))
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
                : {}
            )
        }
    });
};
