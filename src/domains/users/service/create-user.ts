import { Role, SocialType, type PrismaClient } from "@prisma/client";

export const createUser = (
    data: { user: { name?: string; email: string }; social: { type: SocialType; socialId: string }; meta: { role: Role }, fcmToken?: string },
    prisma: PrismaClient
) => {
    return prisma.users.create({
        data: {
            ...data.user,
            socials: {
                create: [{ ...data.social }]
            },
            meta: {
                create: { role: data.meta.role }
            },
            profile: {
                create: {}
            },
            ...(data.fcmToken && {
                token: {
                    create: {
                        token: data.fcmToken
                    }
                }
            }),
            
        },
        select: {
            id: true,
            name: true,
            email: true,
            meta: {
                select: {
                    role: true
                }
            },
            socials: {
                select: {
                    type: true,
                    socialId: true
                }
            },
            profile: true,
            token: true,
        }
    });
};
