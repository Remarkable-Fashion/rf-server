import type { PrismaClient, Users } from "@prisma/client";
import { ExcludeNullAndPartial } from "../../../lib/types";

export type UpdateUser = ExcludeNullAndPartial<Pick<Users, "name" | "phoneNumber">>;

// soft delete
export const deleteUserService = async ({userId, deletedAt}: {userId: number, deletedAt?: Date}, prisma: PrismaClient) => {

    deletedAt =  deletedAt || new Date();
    return prisma.$transaction(async (tx) => {
        await tx.users.update({
            data: {
                deletedAt 
            },
            where: {
                id: userId
            }
        });

        await tx.posts.updateMany({
            where: {
                userId
            },
            data: {
                deletedAt
            }
        })

    })
};
