import type { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getMyPostsService } from "../service/get-my-posts";

const DEFAULT_TAKE = 21;

export const getMyposts = async ( req: Request<unknown, unknown, unknown, {cursor?: string, take?: string}>, res: Response) => {
    const id = req.id;
    if(!id){
        throw new UnauthorizedError();
    }
    const cursor = validateCursor(req.query.cursor);
    const take = validateTake(req.query.take);

    const [totalCountsOfPosts, lastMyPost, posts] = await getMyPostsService({userId: id, cursor, take} ,Prisma)

    const countsOfposts = posts.length;

    const lastPostId = posts.at(-1)?.id!;
    const data = {
        nextCursor: lastPostId,
        hasNext: lastPostId > (lastMyPost?.id ?? 0),
        totalCounts: totalCountsOfPosts,
        size: countsOfposts,
        take,
        cursor: cursor,
        posts,
    }

    res.json(data);
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