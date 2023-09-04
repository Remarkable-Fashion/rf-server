import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
/**
 * @softDelete
 */
export const deletePostByIdService = async (data: { id: number; userId: number }, prisma: PrismaClient) => {
    const rv = await prisma.$transaction(async (tx) => {
        const post = await tx.posts.findFirstOrThrow({
            select: {
                id: true,
                deletedAt: true
            },
            where: {
                id: data.id,
                userId: data.userId
                // deletedAt: {
                //     not: null
                // }
            }
        });
        if (post.deletedAt) {
            /**
             * @todo
             * DBError 클래스에 추가?
             */
            throw new PrismaClientKnownRequestError("Already Deleted", { code: "P2025", meta: undefined, clientVersion: "" });
        }

        const softDeletedPost = await tx.users.update({
            where: {
                id: data.userId
            },
            data: {
                posts: {
                    update: {
                        where: {
                            id: data.id
                        },
                        data: {
                            deletedAt: new Date()
                        }
                    }
                }
            }
        });

        return softDeletedPost;
    });

    return rv;
};
