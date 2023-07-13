import { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { getScrapsAllService } from "../service/get-scraps-all";

type ReqQuerys = {
    take?: string;
    cursor?: string;
};

const DEFAULT_TAKE = 12;
const DEFAULT_CURSUR = 1;

export const getScrapsAll = async (req: Request<unknown, unknown, unknown, ReqQuerys>, res: Response) => {
    const take = validateQueryTake(req.query.take);
    const cursorId = validateQueryCursor(req.query.cursor);

    const {totalCountsOfScraps, lastScrap, scraps} = await getScrapsAllService({ cursorId, take, userId: Number(req.id) }, Prisma);

    if(!scraps || scraps.length <= 0){
        throw new BadReqError("No posts In scrap");
    }

    const lastPostId = scraps.at(-1)!.id!;
    const data = {
        nextCursor: lastPostId,
        hasNext: !!(lastPostId > (lastScrap?.postId ?? 0)),
        totalCounts: totalCountsOfScraps,
        size: scraps.length,
        take,
        cursor: cursorId ?? 0,
        scraps: scraps
    };

    res.status(200).json(data);
};

const validateQueryCursor = (cursor?: string) => {
    if (!cursor) {
        return undefined;
    }

    const parsedCursorId = Number(cursor);
    if (Number.isNaN(parsedCursorId)) {
        throw new BadReqError("Should be Integer 'cursorId'");
    }

    return parsedCursorId;
};

const validateQueryTake = (take?: string) => {
    if (!take) {
        return DEFAULT_TAKE;
    }

    const parsedTake = Number(take);

    if (Number.isNaN(parsedTake)) {
        throw new BadReqError("Should be Integer 'take'");
    }
    return parsedTake < DEFAULT_TAKE ? parsedTake : DEFAULT_TAKE;
};
