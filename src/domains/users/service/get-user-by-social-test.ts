import type { PrismaClient, SocialType } from "@prisma/client";

export const getUserBySocialTestService = ({ type, socialId }: { type: SocialType; socialId: string }, prisma: PrismaClient) => {
    return prisma.socials.findUnique({
        select: {
            id: true,
            type: true,
            socialId: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    meta: {
                        select: {
                            role: true
                        }
                    },
                    token: true,
                    profile: true,
                    deletedAt: true
                }
            }
        },
        where: {
            // eslint-disable-next-line camelcase
            type_socialId: {
                type,
                socialId
            }
        }
        // include: {
        //     user: true
        // }
    });
};
