import type { PrismaClient, SocialType } from "@prisma/client";

export const getUserByEmail = ({ email, type, socialId }: { email: string; type: SocialType; socialId: string }, prisma: PrismaClient) => {
    return prisma.users.findUnique({
        select: {
            id: true,
            email: true,
            name: true,
            meta: {
                select: {
                    role: true
                }
            },
            socials: {
                where: {
                    type,
                    socialId
                },
                select: {
                    type: true,
                    socialId: true
                }
            },
            profile: true
        },
        where: { email }
    });
};
