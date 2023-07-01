import type { PrismaClient, Profile } from "@prisma/client";
import { ExcludeNullAndPartial } from "../../../lib/types";

export type UpdateProfile = ExcludeNullAndPartial<Pick<Profile, "sex" | "height" | "weight" | "introduction" | "avartar">>;

export const updateUser = async (userId: number, data: UpdateProfile, prisma: PrismaClient) => {
    return prisma.profile.update({
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            
        },
        where: { userId }, 
        data 
    });
}