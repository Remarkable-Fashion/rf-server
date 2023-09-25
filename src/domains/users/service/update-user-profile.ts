import type { PrismaClient, Profile } from "@prisma/client";
import { ExcludeNullAndPartial } from "../../../lib/types";

export type UpdateProfile = ExcludeNullAndPartial<Pick<Profile, "sex" | "height" | "weight" | "introduction" | "avartar">> & {name?: string};

export const updateUserProfile = async (userId: number, {name, ...profileData}: UpdateProfile, prisma: PrismaClient) => {

    return prisma.$transaction(async(tx) => {
        if(name){
            await tx.users.update({
                where: {
                    id: userId,
                },
                data: {
                    name
                }
            });
        }

        await tx.profile.update({
            where: { userId },
            data: profileData
        });
    });

    // prisma.users.update({
    //     where: {
    //         id: userId,
    //     },
    //     data: {
    //         name
    //     }
    // })
    // return prisma.profile.update({
    //     where: { userId },
    //     data: profileData
    // });
};
