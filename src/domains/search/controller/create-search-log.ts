import type { Request, Response } from "express";
import { BadReqError } from "../../../lib/http-error";
import { client } from "../../../db/elasticsearch";
import { createSearchLogService } from "../service/create-search-log";
import { SEARCH_LOG_INDEX } from "../constants";


export const createSearch = async (req: Request<unknown, unknown, unknown, {search?: string}>, res: Response) => {

    const query = req.query.search;
    if(!query){
        throw new BadReqError();
    }
    // const DEFAULT_INDEX = "search_log";
    const userId = 1;

    const rv = await createSearchLogService({ query, userId, index: SEARCH_LOG_INDEX }, client);

    console.log("rv ", rv.body);

    res.status(200).json(rv.body);
};
