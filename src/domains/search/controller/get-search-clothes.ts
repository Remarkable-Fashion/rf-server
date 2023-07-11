import type { Request, Response } from "express";
import { BadReqError } from "../../../lib/http-error";
import { client } from "../../../db/elasticsearch";
import { createSearchLogService } from "../service/create-search-log";
import { CLOTHES_INDEX, SEARCH_LOG_INDEX } from "../constants";
import { getSearchClothesService } from "../service/get-search-clothes";
import Prisma from "../../../db/prisma";
import { getClothesByIdsService } from "../../clothes/service/get-clothes-by-ids";

export const getSearchClothes = async (req: Request<unknown, unknown, unknown, { search?: string; take?: string }>, res: Response) => {
    const query = req.query.search;
    if (!query) {
        throw new BadReqError("No 'Search' query string");
    }
    const take = validateSize(req.query.take);
    const clothes = await getSearchClothesService({ query, size: take, index: CLOTHES_INDEX }, client);

    await createSearchLogService({ query, index: SEARCH_LOG_INDEX, userId: req.id }, client);
    const ids = clothes.map((clothe: any) => {
        return clothe.clothes_id;
    });
    
    const [_clothes] = await getClothesByIdsService({userId: req.id, clothesIds: ids}, Prisma);

    const data = {
        size: _clothes.length,
        search: query,
        take,
        posts: _clothes
    };

    res.status(200).json(data);
};

const validateSize = (size?: string) => {
    if (!size) {
        throw new BadReqError("No 'take' query string");
    }

    const parsedSize = Number(size);
    if (Number.isNaN(parsedSize)) {
        throw new BadReqError("'take' should be Number");
    }

    if (parsedSize <= 0 || parsedSize > 20) {
        throw new BadReqError("'take' should be 0 to 20");
    }

    return parsedSize;
};
