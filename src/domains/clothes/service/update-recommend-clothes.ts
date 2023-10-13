import { PrismaClient, Sex, ClothesCategory } from "@prisma/client";
import { NotFoundError } from "../../../lib/http-error";

// export type UpdateRecommendClothes = Omit<Clothes, "id" | "userId" | "clothesId" | "createdAt" | "updatedAt" | "deletedAt" | "postId" | "recommendedClothesId" | "likeCount">;

export type UpdateRecommendClothes = {
    sex?: Sex;
    name?: string;
    category?: ClothesCategory;
    price?: number;
    color?: string;
    size?: string;
    brand?: string;
    reason?: string;
    imageUrl?: string;
}

type ClothesRaw = {
    id: BigInt
}

// export type NotNullUpdateRecommendClothes = NotNull<UpdateRecommendClothes> & {sex?: Sex};
export const updateRecommendClothesService = async (clothesId: number, userId: number, data: UpdateRecommendClothes, prisma: PrismaClient) => {
    return await prisma.$transaction(async (tx) => {

        const clothes =  await tx.$queryRaw<ClothesRaw[]>`
            SELECT 
                c.id 
            FROM 
                clothes c
            JOIN 
                posts p ON c.post_id = p.id 
            JOIN 
                users u ON p.user_id = u.id 
            WHERE 
                c.id = ${clothesId} AND u.id = ${userId}
        `;

        if(!clothes.length) {
            throw new NotFoundError("userId의 clothes가 아닙니다.");
        }

        console.log("clothes :", clothes);
        // const clothes = await tx.clothes.findFirst({
        //     where: {
        //         id: clothesId,
        //         postId
        //     }
        // });
        await tx.clothes.update({
            where: {
                id: clothesId,
                // postId: 1
            },
            data
        })
    });
    // return prisma.clothes.update({
    //     where: {
    //         id: clothesId,
    //         userId
    //     },
    //     data: {
    //         // recommendedClothesId: clothesId,
    //         userId,
    //         ...data
    //     }
    // });
};
