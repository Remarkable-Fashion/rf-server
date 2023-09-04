import { PrismaClient } from "@prisma/client";

export const updatePostByIdService = ({ postId }: { postId: number }, prisma: PrismaClient) => {
    return prisma.posts.update({
        data: {},
        where: {
            id: postId
        }
    });
};
