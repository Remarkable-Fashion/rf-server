import type { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getPostByIdService } from "../service/get-post-by-id";

type ReqParams = {
    id?: string;
};


export const getPostById = async ( req: Request<ReqParams>, res: Response) => {
    if(!req.id){
        throw new UnauthorizedError()
    }

    const id = validateParamId(req.params.id);

    const post = await getPostByIdService({id, userId: req.id}, Prisma)

    const mergedPost = { 
        isFollow: post.user.followers.length > 0,
        isFavorite: post.favorites.length > 0,
        isScrap: post.scraps.length > 0,
        ...post, 
     };

    res.json(mergedPost);
};


const validateParamId = (id?: string) => {
    const parsedId = Number(id);

    if(!id || Number.isNaN(parsedId)){
        throw new BadReqError("Check id");
    }
    return parsedId;
}