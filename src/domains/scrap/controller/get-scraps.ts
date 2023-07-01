import { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { getScraps as getScrapsService } from "../service/get-scraps";

type ReqQuerys = {
    take?: string;
    cursorId?: string;
};

const DEFAULT_TAKE = 12;
const DEFAULT_CURSUR = 1;

export const getScraps = async (req: Request, res: Response) => {

    const _take = req.query.take;
    const _cursorId = req.query.cursorId;

    const parsedTake = Number(_take);
    
    if(_take && Number.isNaN(parsedTake)){
        throw new BadReqError("Should be Integer 'take'");
    }

    const parsedCursorId = Number(_cursorId);
    if(_cursorId && Number.isNaN(parsedCursorId)){
        throw new BadReqError("Should be Integer 'cursorId'");
    }
    const take = _take && parsedTake < DEFAULT_TAKE ? parsedTake : DEFAULT_TAKE;
    const cursorId = _cursorId ? parsedCursorId : undefined;

    const [totalCountsOfScraps, lastScrapedPost, scraps] = await getScrapsService({ cursorId, take, userId: Number(req.id) }, Prisma);

    const mergedScraps = scraps.map(scrap => {
        const isFollow = scrap.post.user.followers.length > 0;
        const isFavoirte = scrap.post.favorites.length > 0;

        return {
            isFavoirte,
            isFollow,
            ...scrap.post
        }
    })

    const data = {
        nextCursorId: scraps.at(-1)?.post.id,
        hasNext: scraps.at(-1)?.post.id! > lastScrapedPost?.postId!,
        totalCounts: totalCountsOfScraps,
        size: scraps.length,
        take,
        // cursorId: cursorId,
        cursorId: cursorId ?? 0,
        scraps: mergedScraps,
    }

    res.status(200).json(data);
};
