import type { Request, Response } from "express";
import { BadReqError, NotFoundError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getPostByIdForDeepLinkService } from "../service/get-post-by-id-for-deeplink";

type ReqParams = {
    id?: string;
};

const validateParamId = (id?: string) => {
    const parsedId = Number(id);

    if (!id || Number.isNaN(parsedId)) {
        throw new BadReqError("Check id");
    }
    return parsedId;
};

type ReqQuery = {
    userId?: string
}

/**
 *
 * @INFO 게시글 정보보기 딥링크
 */
export const getPostByIdForDeeplink = async (req: Request<ReqParams, unknown, unknown, ReqQuery>, res: Response) => {
    // if (!req.id) {
    //     throw new UnauthorizedError();
    // }

    let userId = req.id;
    if(!req.id && req.query.userId) {
        // if(!req.query.userId){
        //     throw new BadReqError("check user Id");
        // }
        userId = +req.query.userId;
    }

    // if(!userId){
    //     throw new BadReqError("check user Id");
    // }

    const id = validateParamId(req.params.id);

    const post = await getPostByIdForDeepLinkService({ id, userId: userId }, Prisma);

    if (!post) {
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
