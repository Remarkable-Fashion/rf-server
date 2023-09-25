import { PrismaClient, Clothes, Sex } from "@prisma/client";
import { NotNull } from "../../../lib/types";

export type CreateRecommendClothes = Omit<Clothes, "id" | "userId" | "clothesId" | "createdAt" | "updatedAt" | "deletedAt" | "postId" | "recommendedClothesId" | "likeCount">;

export type NotNullCreateRecommendClothes = NotNull<CreateRecommendClothes> & {sex?: Sex};
export const createRecommendClothesService = (clothesId: number, userId: number, data: NotNullCreateRecommendClothes, prisma: PrismaClient) => {
    return prisma.clothes.create({
        data: {
            recommendedClothesId: clothesId,
            userId,
            ...data
        }
    });
};
