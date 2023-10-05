import { type PrismaClient } from "@prisma/client";

export const createFcmTokenService = (
    {token, userId}: {token: string, userId: number},
    prisma: PrismaClient
) => {
    return prisma.fcmToken.create({
        data: {
            token,
            userId
        }
    })
};
