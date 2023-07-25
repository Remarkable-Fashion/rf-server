import { ClothesCategory, PrismaClient } from "@prisma/client";
import { BadReqError } from "../../../lib/http-error";

export const getRecommendClothesByIdService = (
    { id, userId, category, cursor, take }: { id: number; userId: number; category?: ClothesCategory; cursor?: number; take: number },
    prisma: PrismaClient
) => {
    return prisma.$transaction(async (tx) => {
        const countOfRecommendClothes = await tx.clothes.count({
            where: {
                recommendedClothesId: id
            }
        });

        const lastRecommendAllClothes = await tx.clothes.findFirst({
            where: {
                recommendedClothesId: id
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        const clothes = await tx.clothes.findMany({
            select: {
                id: true,
                // recommendedClothesId: true,
                // userId: true,
                name: true,
                createdAt: true,
                _count: {
                    select: {
                        favorites: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        followers: {
                            select: {
                                followerId: true,
                                followingId: true
                            },
                            where: {
                                followerId: userId
                            }
                        },
                        profile: {
                            select: {
                                avartar: true
                            }
                        }
                    }
                },
                favorites: {
                    select: {
                        userId: true,
                        clothesId: true
                    },
                    where: {
                        userId
                    }
                },
                scraps: {
                    select: {
                        userId: true,
                        clothesId: true
                    },
                    where: {
                        userId
                    }
                }
            },
            where: {
                // id,
                // @info cursor가 undefined여도 제대로 출력됨. 아래처럼 안해도됨.
                id: {
                    lt: cursor
                },
                // ...(cursor && {
                //     id: {
                //         lt: cursor
                //     }
                // }),
                recommendedClothesId: id,
                category
            },
            orderBy: [
                {
                    id: "desc"
                }
                // @info 좋아요 순으로 출력
                // {
                //     favorites: {
                //         _count: "desc"
                //     }
                // }
            ],
            take
        });

        const objs = [];

        for (const clothe of clothes) {
            const { user, favorites, scraps, ...restClothe } = clothe;
            if (!user) {
                throw new BadReqError("DB Error recommendClothes Should have userId");
            }
            const { followers, ...restUser } = user;
            // const isFavorite = await tx.favorites.findUnique({
            //     where: {
            //         userId_clothesId: {
            //             userId,
            //             clothesId: rest.id
            //         }
            //     }
            // });
            const isFavorite = favorites.length > 0;
            const isScrap = scraps.length > 0;

            const obj = {
                isFavorite: !!isFavorite,
                isFollwoing: followers.length > 0,
                isScrap,
                ...restClothe,
                user: restUser
            };

            objs.push(obj);
        }

        return {
            clothes: objs,
            countOfRecommendClothes,
            lastRecommendAllClothes
        };
    });
};
