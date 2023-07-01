import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getMyFollowersService } from "../service/get-my-followers";


const DEFAULT_TAKE = 21;
/**
 * @TODO 
 * 1. 페이지네이션
 * 2. 팔로잉 팔로워 수 제한?
 */
export const getMyFollowers = async (req: Request<unknown, unknown, unknown, {cursorId?: string, take?: string}>, res: Response) => {

    if(!req.id){
        throw new UnauthorizedError()
    }

    const cursor = validateCursor(req.query.cursorId);
    const take = validateTake(req.query.take);

    const [counts, lastMyFollower, followers] = await getMyFollowersService({userId: req.id, cursor, take }, Prisma);

    const data = {
        nextCursorId: followers.at(-1)?.follower.id,
        hasNext: followers.at(-1)?.follower.id! > lastMyFollower?.followerId!,
        totalCounts: counts,
        size: followers.length,
        take,
        cursorId: cursor,
        followers: followers.map(follower => {
            return {
                user: follower.follower,
                createdAt: follower.createdAt,
            }
        })
    };

    // nextCursorId: scraps.at(-1)?.post.id,
    // hasNext: scraps.at(-1)?.post.id! > lastScrapedPost?.postId!,
    // totalCounts: totalCountsOfScraps,
    // size: scraps.length,
    // take,

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