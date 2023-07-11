import type { PrismaClient, Users } from "@prisma/client";
import { ExcludeNullAndPartial } from "../../../lib/types";

export type UpdateUser = ExcludeNullAndPartial<Pick<Users, "name" | "phoneNumber">>;

export const updateUserService = async (userId: number, data: UpdateUser, prisma: PrismaClient) => {
    return prisma.users.update({
        data: {
            ...data
        },
        where: {
            id: userId
        }
    });
};
