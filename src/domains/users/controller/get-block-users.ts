import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getBlockUsersService } from "../service/get-block-users";

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

export const getBlockUsers = async (req: Request<{ id?: string }, unknown, unknown, { cursor?: string; take?: string }>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const cursor = validateCursor(req.query.cursor);
    const take = validateTake(req.query.take);

    const userId = req.params.id === "me" ? req.id : Number(req.params.id);

    const [counts, oldestBlockedUser, blockedUsers] = await getBlockUsersService({ userId, cursor, take }, Prisma);

    let hasNext = false;
    if (blockedUsers.length <= 0) {
        const data = {
            nextCursor: null,
            hasNext,
            // hasNext: lastBlockedUserId > (lastMyBlockedUser?.blockedId ?? 0),
            totalCounts: counts,
            size: 0,
            take,
            cursor,
            blockedUsers: []
        };
        res.json(data);
        return;
    }
    const lastBlockUser = blockedUsers[blockedUsers.length - 1];
    const nextCursor = lastBlockUser.createdAt;
    if (nextCursor && oldestBlockedUser) {
        hasNext = new Date(nextCursor).getTime() > new Date(oldestBlockedUser.createdAt).getTime();
    }

    const data = {
        nextCursor,
        hasNext,
        // hasNext: lastBlockedUserId > (lastMyBlockedUser?.blockedId ?? 0),
        totalCounts: counts,
        size: blockedUsers.length,
        take,
        cursor,
        blockedUsers: blockedUsers.map((blokedUser) => {
            return {
                user: blokedUser.blocked,
                createdAt: blokedUser.createdAt
            };
        })
    };
    res.json(data);
};
