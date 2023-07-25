import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getMyFollowingsService } from "../service/get-my-followings";

const DEFAULT_TAKE = 21;

const validateCursor = (cursor?: string) => {
    if (!cursor) {
        return undefined;
    }
    const date = Date.parse(cursor);

    if (Number.isNaN(date)) {
        throw new BadReqError("cursor should be String Date");
    }

    return cursor;

    // const _cursor = cursor ? Number(cursor) : undefined;
    // if(_cursor && _cursor < 0){
    //     throw new BadReqError("cursor should be higher than 0")
    // }

    // return _cursor;
};

const validateTake = (take?: string) => {
    const takeT = take ? Number(take) : DEFAULT_TAKE;

    if (take && takeT < 0) {
        throw new BadReqError("take should be higher than 0");
    }

    return takeT;
};

export const getMyFollowings = async (req: Request<unknown, unknown, unknown, { cursor?: string; take?: string }>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const cursor = validateCursor(req.query.cursor);
    const take = validateTake(req.query.take);

    const [counts, oldestFollowing, followings] = await getMyFollowingsService({ userId: req.id, cursor, take }, Prisma);
    let hasNext = false;
    if (followings.length <= 0) {
        const data = {
            nextCursor: null,
            hasNext,
            totalCounts: counts,
            size: 0,
            take,
            cursor,
            followings: []
        };
        res.json(data);
        return;
    }

    const lastFollowing = followings[followings.length - 1];

    const nextCursor = lastFollowing.createdAt;

    if (nextCursor && oldestFollowing) {
        hasNext = new Date(nextCursor).getTime() > new Date(oldestFollowing.createdAt).getTime();
    }

    const data = {
        nextCursor,
        hasNext,
        // hasNext: lastFollowingId > (lastOfFollowing?.followingId ?? 0),
        totalCounts: counts,
        size: followings.length,
        take,
        cursor,
        followings: followings.map((following) => {
            return {
                user: following.following,
                createdAt: following.createdAt
            };
        })
    };
    res.json(data);
};
