import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getMyFollowingsService } from "../service/get-my-followings";

const DEFAULT_TAKE = 21;
export const getMyFollowings = async (req: Request<unknown, unknown, unknown, {cursorId?: string, take?: string}>, res: Response) => {

    if(!req.id){
        throw new UnauthorizedError();
    }

    const cursor = validateCursor(req.query.cursorId);
    const take = validateTake(req.query.take);

    const [counts, lastOfFollowing, followings] = await getMyFollowingsService({userId: req.id, cursor, take }, Prisma);
 
    const data = {
        nextCursorId: followings.at(-1)?.following.id,
        hasNext: followings.at(-1)?.following.id! > lastOfFollowing?.followingId!,
        totalCounts: counts,
        size: followings.length,
        take,
        cursorId: cursor,
        followings: followings.map(following => {
            return {
                user: following.following,
                createdAt: following.createdAt,
            }
        })
    }
    res.json(data);
}

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