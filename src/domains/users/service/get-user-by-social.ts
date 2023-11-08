import type { PrismaClient, SocialType } from "@prisma/client";

export const getUserBySocialService = ({ type, socialId }: { type: SocialType; socialId: string }, prisma: PrismaClient) => {
    return prisma.socials.findUnique({
        select: {
            id: true,
            type: true,
            socialId: true,
            userId: true,
        },
        where: {
            type_socialId: {
                type: type,
                socialId: socialId
            }
        }
    })
};
