import { PrismaClient } from "@prisma/client";

export const createTmpImagesService = ( urls: string[], prisma: PrismaClient) => {
    return prisma.tmpImages.createMany({
        data: urls.map(url => ({url}))
    });
};
