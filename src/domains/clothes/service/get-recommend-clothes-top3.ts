import { ClothesCategory, PrismaClient } from "@prisma/client";
import { Unarray } from "../../../lib/types";
import { BadReqError } from "../../../lib/http-error";
// type Unarray<T> = T extends Array<infer U> ? U : T;
const DEFAULT_TAKE = 3;
export const getRecommendClothesByIdTop3Service = (id: number, userId: number, category: ClothesCategory, prisma: PrismaClient) => {
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
                                followerId: userId
                            }
                        },
                        profile: {
                            select: {
                                avartar: true,
                            }
                        }
                    }
                }
            },
            where: {
                recommendedClothesId: id,
                category
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
            if(!user){
                throw new BadReqError("DB Error recommendClothes Should have userId")
            }
            const { followers, ...restUser } = user;
            const isFavorite = await tx.favorites.findUnique({
                where: {
                    userId_clothesId: {
                        userId,
                        clothesId: rest.id
                    }
                }
            });

            const obj: RecommendClothes = {
                isFavorite: !!isFavorite,
                isFollowing: user.followers.length > 0,
                ...rest,
                user: restUser
            };

            objs.push(obj);
        }

        return [objs];
    });
};
