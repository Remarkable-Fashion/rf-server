import { PrismaClient } from "@prisma/client";

export const getSearchTestService = ({ search }: { search: string }, prisma: PrismaClient) => {
    return prisma.posts.findMany({
        where: {
            title: {
                search: `${search}*`
            }
        }
    });
};
