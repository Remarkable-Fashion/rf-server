import { ClothesCategory, PrismaClient } from "@prisma/client";
import { BadReqError } from "../../../lib/http-error";
// type Unarray<T> = T extends Array<infer U> ? U : T;
const DEFAULT_TAKE = 3;
export const getRecommendClothesByIdTop3Service = (data: { id: number; userId: number; category?: ClothesCategory }, prisma: PrismaClient) => {
    return prisma.$transaction(async (tx) => {
        const recommendClothes = await tx.clothes.findMany({
            select: {
                id: true,
                category: true,
                name: true,
                price: true,
                color: true,
                size: true,
                brand: true,
                reason: true,
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
                                followerId: data.userId
                            }
                        },
                        profile: {
                            select: {
                                avartar: true
                            }
                        }
                    }
                }
            },
            where: {
                recommendedClothesId: data.id,
                category: data.category
            },
            orderBy: [
                {
                    favorites: {
                        _count: "desc"
                    }
                },
                {
                    createdAt: "desc"
                }
            ],
            take: DEFAULT_TAKE
        });

        const objs = [];

        for (const { user, ...rest } of recommendClothes) {
            if (!user) {
                throw new BadReqError("DB Error recommendClothes Should have userId");
            }
            const { followers, ...restUser } = user;
            const isFavorite = await tx.favorites.findUnique({
                where: {
                    // eslint-disable-next-line camelcase
                    userId_clothesId: {
                        userId: data.userId,
                        clothesId: rest.id
                    }
                }
            });

            const obj = {
                isFavorite: !!isFavorite,
                isFollowing: user.followers.length > 0,
                clothesInfo: rest,
                user: restUser
            };

            objs.push(obj);
        }

        return [objs];
    });
};
