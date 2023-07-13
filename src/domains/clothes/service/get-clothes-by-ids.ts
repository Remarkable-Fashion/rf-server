import { PrismaClient } from "@prisma/client";

export const getClothesByIdsService = ({ userId, clothesIds }: { userId: number; clothesIds: number[] }, prisma: PrismaClient) => {
    return prisma.$transaction(async (tx) => {
        const clothes = await tx.clothes.findMany({
            select: {
                id: true,
                brand: true,
                name: true,
                price: true,
                category: true,
                color: true,
                size: true,
                imageUrl: true,
                createdAt: true,
                _count: {
                    select: {
                        favorites: true,
                    }
                },
                favorites: {
                    select: {
                        userId: true,
                        clothesId: true,
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
                id: {
                    in: clothesIds
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const mergedClothes = clothes.map( ({favorites, scraps, ...restClothe}) => {
            const isFavoirte = favorites.length > 0;
            const isScrap = scraps.length > 0;

            return {
                isFavoirte,
                isScrap,
                clothes: restClothe
            }
        });

        return [mergedClothes]
    });
}