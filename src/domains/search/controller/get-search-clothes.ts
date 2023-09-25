import type { Request, Response } from "express";
import { BadReqError } from "../../../lib/http-error";
import { client } from "../../../db/elasticsearch";
import { createSearchLogService } from "../service/create-search-log";
import { CLOTHES_INDEX, RECENT_SEARCH_SIZE, SEARCH_LOG_INDEX } from "../constants";
import { getSearchClothesService } from "../service/get-search-clothes";
import Prisma from "../../../db/prisma";
import { getClothesByIdsService } from "../../clothes/service/get-clothes-by-ids";
import { redisClient } from "../../../db/redis";

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

const validatePriceRange = (price?: unknown) => {
    if(!price){
        return;
    }

    if(!Array.isArray(price)){
        throw new BadReqError("price는 배열이어야 합니다.");
    }
    const priceRange = (price as string[]).map( p => {
        const rv = Number(p);

        if (Number.isNaN(rv)) {
            throw new BadReqError("'price' should be Number");
        }

        return rv;

    });

    priceRange.sort();

    if(priceRange.length !== 2){
        throw new BadReqError("price max, min이 필요합니다.");
    }

    return priceRange;
}

const validateColor = (color?: string | string[]) => {
    if(!color) {
        return [];
    }

    if(!Array.isArray(color)){
        return [color];
    }

    return color;
}

const validateSex = (sex?: string) => {
    if(!sex){
        return;
    }
    if(sex !== "Male" && sex !== "Female"){
        throw new BadReqError("sex must be Male or Female");
    }

    return sex;
}

/**
 * @TODO order와 cursor, posts 참고.
 */
export const getSearchClothes = async (req: Request<unknown, unknown, unknown, { search?: string; take?: string; priceRange?: string[]; color?: string; sex?: string }>, res: Response) => {
    const query = req.query.search;
    if (!query) {
        throw new BadReqError("No 'Search' query string");
    }
    const take = validateSize(req.query.take);
    const priceRange = validatePriceRange(req.query.priceRange);
    const colors = validateColor(req.query.color);
    const sex = validateSex(req.query.sex);

    const clothes = await getSearchClothesService({ query, size: take, index: CLOTHES_INDEX, priceRange, colors, sex }, client);

    const redisSearch = `${SEARCH_LOG_INDEX}:${req.id}`;
    await redisClient.lPush(redisSearch, query);
    await redisClient.lTrim(redisSearch, RECENT_SEARCH_SIZE - 10, RECENT_SEARCH_SIZE - 1);

    await createSearchLogService({ query, index: SEARCH_LOG_INDEX, userId: req.id }, client);
    const ids = clothes.map((clothe: any) => {
        return clothe.id;
        // return clothe.clothes_id;
    }) as number[];

    if (ids.length <= 0) {
        const data = {
            size: 0,
            search: query,
            take,
            clothes: []
        };
        res.json(data);
        return;
    }

    const [clothes_] = await getClothesByIdsService({ userId: req.id, clothesIds: ids }, Prisma);

    const data = {
        size: clothes_.length,
        search: query,
        take,
        clothes: clothes_
    };

    res.status(200).json(data);
};
