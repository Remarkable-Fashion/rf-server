import type { Request, Response } from "express";
import { conf } from "../../../config";
import { redis } from "../../../db/redis";
import { getRecentSearch as getRecentSearchService } from "../service/get-recent-search";

export const getRecentSearch = async (req: Request<unknown, unknown>, res: Response) => {
    const userId = req.id;

    const { SEARCH_PRE_FIX, RECENT_SEARCH_COUNT } = conf();

    const key = `${SEARCH_PRE_FIX}:${userId}`;
    const results = await getRecentSearchService({ key, count: RECENT_SEARCH_COUNT }, redis);
    res.status(200).json(results);
};
