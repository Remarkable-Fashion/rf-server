import { ClothesCategory, PrismaClient } from "@prisma/client";
import { Unarray } from "../../../lib/types";
// type Unarray<T> = T extends Array<infer U> ? U : T;
const DEFAULT_TAKE = 3;
export const getRecommendClothesByIdService = (id: number, userId: number, category: ClothesCategory, prisma: PrismaClient) => {
    return prisma.$transaction(async (tx) => {
        const recommendClothes = await tx.recommendClothes.findMany({
            select: {
                id: true,
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
                        }
                    }
                }
            },
            where: {
                clothesId: id,
                category
            },
            orderBy: {
                favorites: {
                    _count: "desc"
                }
            },
            take: DEFAULT_TAKE
        });

        type RecommendClothesArray = Omit<Unarray<typeof recommendClothes>, "user"> & {
            user: {
                name?: string | null;
            };
        };
        type RecommendClothes = RecommendClothesArray & {
            isFavorite: boolean;
            isFollowing: boolean;
        };

        const objs: RecommendClothes[] = [];

        for (const { user, ...rest } of recommendClothes) {
            const { followers, ...restUser } = user;
            const isFavoirte = await tx.favorites.findUnique({
                where: {
                    userId_recommendClothesId: {
                        userId,
                        recommendClothesId: rest.id
                    }
                }
            });

            const obj: RecommendClothes = {
                isFavorite: !!isFavoirte,
                isFollowing: user.followers.length > 0,
                ...rest,
                user: restUser
            };

            objs.push(obj);
        }

        return [objs];
    });
};
