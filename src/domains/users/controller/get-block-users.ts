import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getBlockUsersService } from "../service/get-block-users";


const DEFAULT_TAKE = 21;
export const getBlockUsers = async (req: Request<unknown, unknown, unknown, {cursorId?: string, take?: string}>, res: Response) => {

    if(!req.id){
        throw new UnauthorizedError()
    }

    const cursor = validateCursor(req.query.cursorId);
    const take = validateTake(req.query.take);

    const [counts, lastMyBlockedUser, blokedUsers] = await getBlockUsersService({userId: req.id, cursor, take}, Prisma);
    
    const data = {
        nextCursorId: blokedUsers.at(-1)?.blocked.id,
        hasNext: blokedUsers.at(-1)?.blocked.id! > lastMyBlockedUser?.blockedId!,
        totalCounts: counts,
        size: blokedUsers.length,
        take,
        cursorId: cursor,
        blokedUsers: blokedUsers.map(blokedUser => {
            return {
                user: blokedUser.blocked,
                createdAt: blokedUser.createdAt
            }
        }),
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