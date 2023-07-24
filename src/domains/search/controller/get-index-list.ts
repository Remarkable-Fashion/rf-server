import type { Request, Response } from "express";
import { getIndexListService } from "../service/get-index-list";
import { client } from "../../../db/elasticsearch";

export const getIndexList = async (req: Request, res: Response) => {
    // const _previousRank = typia.assertParse<Rank[]>(searchRank);
    // console.log("_previousRank :", _previousRank);
    const indexs = await getIndexListService(client);

    res.status(200).json(indexs);
};
