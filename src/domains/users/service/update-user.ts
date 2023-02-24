import type { PrismaClient, Profile } from "@prisma/client";
import { WithoutNull } from "../../../lib/types";

export type UpdateProfile = WithoutNull<Pick<Profile, "sex" | "height" | "weight" | "introduction">>;

export const updateUser = async (userId: number, data: UpdateProfile, prisma: PrismaClient) => {
    return prisma.profile.update({where: { userId }, data });
}