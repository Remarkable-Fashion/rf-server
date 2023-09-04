import { PrismaClient } from "@prisma/client";

export const updatePostStatusService = ({ isPublic, postId }: { isPublic: boolean; postId: number }, prisma: PrismaClient) => {
    return prisma.posts.update({
        data: {
            isPublic
        },
        where: {
            id: postId
        }
    });
};
