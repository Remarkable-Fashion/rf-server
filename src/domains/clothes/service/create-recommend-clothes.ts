import { PrismaClient, RecommendClothes } from "@prisma/client";
import { ExcludeNullAndPartial, NotNull } from "../../../lib/types";

export type CreateRecommendClothes = Omit<RecommendClothes, "id" | "userId" | "clothesId" | "createdAt">;

export type NotNullCreateRecommendClothes = NotNull<CreateRecommendClothes>;
// export type _CreateRecommendClothes = ExcludeNullAndPartial<CreateRecommendClothes>;
export const createRecommendClothesService = (clothesId: number, userId: number, data: NotNullCreateRecommendClothes, prisma: PrismaClient) => {
    return prisma.recommendClothes.create({
        data: {
            clothesId,
            userId,
            ...data
        }
    });
};
