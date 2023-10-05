import type { PrismaClient } from "@prisma/client";


export const updateFcmTokenService = async (userId: number, fcmToken: string, prisma: PrismaClient) => {

    return prisma.fcmToken.update({
        where: {
            userId: userId
        },
        data: {
            token: fcmToken
        }
    });
};
