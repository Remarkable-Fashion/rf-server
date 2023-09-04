import type { Request, Response } from "express";
import { client } from "../../../db/elasticsearch";
import { getRecentSearchByUserIdService } from "../service/get-recent-search-by-user-id";
import { RECENT_SEARCH_SIZE, SEARCH_LOG_INDEX } from "../constants";
import { redisClient } from "../../../db/redis";

// const SIZE = 10;
export const getRecentSearchByUserId = async (req: Request<unknown, unknown, unknown, { search?: string; size?: string }>, res: Response) => {
    const rv = await getRecentSearchByUserIdService({ index: SEARCH_LOG_INDEX, userId: req.id, size: RECENT_SEARCH_SIZE }, client);

    const redisSearch = `${SEARCH_LOG_INDEX}:${req.id}`;
    await redisClient.lRange(redisSearch, RECENT_SEARCH_SIZE - 10, RECENT_SEARCH_SIZE - 1);

    // console.log("rv ", rv.body.hits.hits);
    const logs = rv.body.hits.hits.map((log: any) => {
        return log._source.query;
    });

    res.status(200).json({
        searchs: logs
    });
    // res.status(200).json(rv.body.hits.hits);
};

// const validateSize = (size?: string) => {
//     if(!size){
//         throw new BadReqError("No 'size' query string");
//     }

//     const parsedSize = Number(size);
//     if(Number.isNaN(parsedSize)){
//         throw new BadReqError("'size' should be Number");
//     }

//     if(parsedSize <= 0 || parsedSize > 20){
//         throw new BadReqError("'size' should be 0 to 20");
//     }

//     return parsedSize;
// }
