import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { getMyFavoritesService } from "../service/get-my-favorites";
import { getSearchTestService } from "../service/get-search-posts";

const DEFAULT_TAKE = 21;

export const getTestSearchPosts = async (req: Request<unknown, unknown, unknown, {search?: string}>, res: Response) => {

    const search = req.query.search;

    if(!search){
        throw new BadReqError();
    }

    console.log("search :", search);

    const results = await getSearchTestService({search}, Prisma)
    
    res.status(200).json(results);
};

const validateCursor = (cursor?: string) => {

    const _cursor = cursor ? Number(cursor) : undefined;
    if(_cursor && _cursor < 0){
        throw new BadReqError("cursor should be higher than 0")
    }

    return _cursor;
}


const validateTake = (take?: string) => {

    let _take = take ? Number(take) : DEFAULT_TAKE;

    if(take && _take < 0){
        throw new BadReqError("take should be higher than 0")
    }

    return _take;
}