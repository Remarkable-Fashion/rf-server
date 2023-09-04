import { PrismaClient } from "@prisma/client";

export const getSearchTestService = ({ search }: { search: string }, prisma: PrismaClient) => {
    return prisma.posts.findMany({
        where: {
            // title: { // title 컬럼 삭제로 인한 수정.
            description: {
                search: `${search}*`
            }
        }
    });
};
