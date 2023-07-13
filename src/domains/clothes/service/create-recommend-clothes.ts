import { PrismaClient, Clothes } from "@prisma/client";
import { NotNull } from "../../../lib/types";

export type CreateRecommendClothes = Omit<Clothes, "id" | "userId" | "clothesId" | "createdAt" | "postId" | "recommendedClothesId">;

export type NotNullCreateRecommendClothes = NotNull<CreateRecommendClothes>;
// export type _CreateRecommendClothes = ExcludeNullAndPartial<CreateRecommendClothes>;
export const createRecommendClothesService = (clothesId: number, userId: number, data: NotNullCreateRecommendClothes, prisma: PrismaClient) => {
    return prisma.clothes.create({
        data: {
            recommendedClothesId: clothesId,
            userId,
            ...data
        }
    });
};
