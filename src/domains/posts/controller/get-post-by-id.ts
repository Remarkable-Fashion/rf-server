import type { Request, Response } from "express";
import { mongo } from "../../../db/mongodb";
import { createYearMonthString } from "../../../lib/create-date";
import { getRandomPostsMongo as getRandomPostsMongoService } from "../service/get-random-posts";
import { POST_PRE_FIX, postSex } from "../types";
import { createCollectionName } from "../create-collection-name";
import typia from "typia"
import { BadReqError } from "../../../lib/http-error";
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

    const post = await getPostByIdService(parsedId ,Prisma)

    res.json(post);
};
