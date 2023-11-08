import type { PrismaClient, SocialType } from "@prisma/client";

export const createSocialService = ({ userId, type, socialId }: { userId: number, type: SocialType; socialId: string }, prisma: PrismaClient) => {
    return prisma.socials.create({
        data: {
            userId,
            type,
            socialId
        }
    })
};
