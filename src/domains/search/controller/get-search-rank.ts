import type { Request, Response } from "express";
import { redisClient } from "../../../db/redis";
import { NotFoundError } from "../../../lib/http-error";
import { REDIS_SEARCH_RANK_KEY } from "../constants";

export const getSearchRank = async (req: Request, res: Response) => {
    const searchRank = await redisClient.get(REDIS_SEARCH_RANK_KEY);

    if (!searchRank) {
        throw new NotFoundError("No Search Rank");
    }
    // const _previousRank = typia.assertParse<Rank[]>(searchRank);
    // console.log("_previousRank :", _previousRank);
    const previousRank = JSON.parse(searchRank);

    res.status(200).json(previousRank);
};
