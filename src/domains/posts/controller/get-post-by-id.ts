import type { Request, Response } from "express";
import { BadReqError, NotFoundError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getPostByIdService } from "../service/get-post-by-id";

type ReqParams = {
    id?: string;
};

/**
 * 
 * @INFO 게시글 정보보기
 */
export const getPostById = async (req: Request<ReqParams>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const id = validateParamId(req.params.id);

    const post = await getPostByIdService({ id, userId: req.id }, Prisma);

    if(!post){
        throw new NotFoundError("No post");
    }
    // const mergedPost = {
    //     isFollow: post.user.followers.length > 0,
    //     isFavorite: post.favorites.length > 0,
    //     isScrap: post.scraps.length > 0,
    //     ...post
    // };

    res.json(post);
};

const validateParamId = (id?: string) => {
    const parsedId = Number(id);

    if (!id || Number.isNaN(parsedId)) {
        throw new BadReqError("Check id");
    }
    return parsedId;
};
