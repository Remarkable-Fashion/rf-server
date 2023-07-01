import type { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getPostByIdService } from "../service/get-post-by-id";

type ReqParams = {
    id?: string;
};


export const getPostById = async ( req: Request<ReqParams>, res: Response) => {
    const { id } = req.params;

    const parsedId = Number(id);

    if(!id || Number.isNaN(parsedId)){
        throw new BadReqError("Check id");
    }

    if(!req.id){
        throw new UnauthorizedError()
    }

    const post = await getPostByIdService({id: parsedId, userId: req.id}, Prisma)

    const mergedPost = { ...post, isFollow: post.user.followers.length > 0 };

    res.json(mergedPost);
};
