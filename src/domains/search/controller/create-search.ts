import type { Request, Response } from "express";
import TSON from "typescript-json";
import { conf } from "../../../config";
import { redis } from "../../../db/redis";
import { BadReqError } from "../../../lib/http-error";
import { unixTimestamp } from "../../../lib/unix-timestamp";
import { createSearch as createSearchService } from "../service/create-search";

type ReqBody = {
    text: string;
};
// @TODO 검색에 대한 결과는 무엇을 보여줄까 ?
export const createSearch = async (req: Request<unknown, unknown, ReqBody>, res: Response) => {
    const userId = req.id;

    const { success, errors } = TSON.validate<ReqBody>(req.body);
    if (!success) {
        throw new BadReqError(TSON.stringify(errors));
    }

    const { SEARCH_PRE_FIX, RECENT_SEARCH_COUNT } = conf();

    const key = `${SEARCH_PRE_FIX}:${userId}`;
    const data = { score: unixTimestamp(), value: req.body.text };

    await createSearchService({ data, count: RECENT_SEARCH_COUNT, key }, redis);

    res.status(200).json();
};
