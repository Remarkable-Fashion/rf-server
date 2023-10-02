import { ImageType, PrismaClient } from "@prisma/client";

export const createTmpImagesService = (urls: string[], type: ImageType, prisma: PrismaClient) => {
    return prisma.tmpImages.createMany({
        data: urls.map((url) => ({ url, type: type }))
    });
};
