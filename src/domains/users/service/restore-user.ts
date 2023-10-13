import type { PrismaClient, Users } from "@prisma/client";
import { ExcludeNullAndPartial } from "../../../lib/types";

export type UpdateUser = ExcludeNullAndPartial<Pick<Users, "name" | "phoneNumber">>;

// soft delete
export const restoreUserService = async ({userId}: {userId: number}, prisma: PrismaClient) => {

    return prisma.$transaction(async (tx) => {
        await tx.users.update({
            data: {
                deletedAt: null
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
                deletedAt: null
            }
        })

    })
};
