import { PrismaClient, Tpos } from "@prisma/client";
import { postSex } from "../types";
import { BadReqError } from "../../../lib/http-error";

export type UpdatePostBody = {
    imgUrls?: string[];
    description?: string;
    // tpos?: Tpos[];
    // tpos?: string[];
    // seasons?: string[];
    // styles?: string[];
    isPublic?: boolean;
    sex?: typeof postSex[number];
    height?: number;
    weight?: number;
};

export const updatePostByIdService = ({ postId, data }: { postId: number, data: UpdatePostBody }, prisma: PrismaClient) => {
    return prisma.$transaction(async (tx) => {
        const rv = await tx.posts.findFirst({
            where: {
                id: postId,
                deletedAt: null
            }
        });

        if(!rv){
            throw new BadReqError("이미 삭제된 post");
        }

        return await tx.posts.update({
            data,
            where: {
                id: postId,
            }
        });
    });
    // return prisma.posts.updateMany({
    //     data,
    //     where: {
    //         id: postId,
    //         deletedAt: null
    //     }
    // })
    // return prisma.posts.update({
    //     data,
    //     where: {
    //         id: postId,
    //         deletedAt: null
    //     }
    // });
};
