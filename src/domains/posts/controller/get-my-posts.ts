import type { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getMyPostsService } from "../service/get-my-posts";

const DEFAULT_TAKE = 21;

export const getMyposts = async ( req: Request<unknown, unknown, unknown, {cursorId?: string, take?: string}>, res: Response) => {
    const id = req.id;
    if(!id){
        throw new UnauthorizedError();
    }

    const _cursor = req.query.cursorId;
    const _take = req.query.take;

    const cursor = _cursor ? Number(_cursor) : undefined;
    if(cursor && cursor < 0){
        throw new BadReqError("cursor should be higher than 0")
    }
    const take = _take ? Number(_take) : DEFAULT_TAKE;

    const posts = await getMyPostsService({id, cursor, take} ,Prisma)

    const countsOfposts = posts.length;

    res.json({posts: posts, _count: countsOfposts});
};
