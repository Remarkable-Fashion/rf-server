import { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { getScraps as getScrapsService } from "../service/get-scraps";

type ReqQuerys = {
    take?: string;
    cursor?: string;
};

const DEFAULT_TAKE = 12;
const DEFAULT_CURSUR = 1;

export const getScraps = async (req: Request<unknown, unknown, unknown, ReqQuerys>, res: Response) => {
    const take = validateQueryTake(req.query.take);
    const cursorId = validateQueryCursor(req.query.cursor);

    const {totalCountsOfScraps, lastScrapedPost, posts} = await getScrapsService({ cursorId, take, userId: Number(req.id) }, Prisma);
    // const [totalCountsOfScraps, lastScrapedPost, scraps] = await getScrapsService({ cursorId, take, userId: Number(req.id) }, Prisma);

    // const mergedScraps = scraps.map((scrap) => {
    //     const isFollow = scrap.post.user.followers.length > 0;
    //     const isFavoirte = scrap.post.favorites.length > 0;

    //     return {
    //         isFavoirte,
    //         isFollow,
    //         ...scrap.post
    //     };
    // });

    if(!posts || posts.length <= 0){
        throw new BadReqError("");
    }

    // const asdfasdf = scraps.at(-1);
    const lastPostId = posts.at(-1)!.id!;
    const data = {
        nextCursor: lastPostId,
        hasNext: !!(lastPostId > (lastScrapedPost?.postId ?? 0)),
        totalCounts: totalCountsOfScraps,
        size: posts,
        take,
        cursor: cursorId ?? 0,
        posts: posts
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
