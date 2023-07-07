import { Role, SocialType, type PrismaClient } from "@prisma/client";

export const findUserOrCreate = (data: { user: {name?: string; email: string}, social: { type: SocialType, socialId: string}, meta: { role: Role } }, prisma: PrismaClient) => {
    return prisma.users.upsert({
        where: {
            email: data.user.email,
        },
        create: {
            ...data.user,
            socials: {
                create: [{ ...data.social }]
            },
            meta: {
                create: { role: data.meta.role }
            },
            profile: {
                create: {}
            }
        },
        update: {},
        select: {
            id: true,
            name: true,
            email: true,
            meta: {
                select: {
                    role: true
                }
            },
            socials:{
                select: {
                    type: true,
                    socialId: true
                }
            },
            profile: true
        }
    });
};
