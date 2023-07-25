import { Request, Response } from "express";
import { ClothesCategory } from "@prisma/client";
import typia from "typia";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { validateBody } from "../../../lib/validate-body";
import { getRecommendClothesByIdService } from "../service/get-recommend-clothes";

const DEFAULT_TAKE = 21;

const validateQueryCategory = (category?: string) => {
    if (!category) {
        // throw new BadReqError("Query string 'category' shoul be");
        return undefined;
    }

    return validateBody(typia.createValidateEquals<ClothesCategory>())(category);
};

const validateCursor = (cursor?: string) => {
    const cursorT = cursor ? Number(cursor) : undefined;
    if (cursorT && cursorT < 0) {
        throw new BadReqError("cursor should be higher than 0");
    }

    return cursorT;
};

const validateTake = (take?: string) => {
    const takeT = take ? Number(take) : DEFAULT_TAKE;

    if (take && takeT < 0) {
        throw new BadReqError("take should be higher than 0");
    }

    return takeT;
};
const validateParamClothesId = (id?: string) => {
    if (!id) {
        throw new BadReqError("Check Params id");
    }

    const parsedId = Number(id);
    if (Number.isNaN(parsedId)) {
        throw new BadReqError("Params Shoud be Number");
    }

    return parsedId;
};

/**
 * @info 이 의상은 어때
 * 페이지네이션
 * @TODO 좋아요 순?
 */
export const getRecommendClothesById = async (
    req: Request<{ id?: string }, unknown, unknown, { category?: string; cursor?: string; take?: string }>,
    res: Response
) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const category = validateQueryCategory(req.query.category);
    const cursor = validateCursor(req.query.cursor);
    const take = validateTake(req.query.take);
    const clothesId = validateParamClothesId(req.params.id);

    const {
        countOfRecommendClothes,
        clothes: recommendClothes,
        lastRecommendAllClothes
    } = await getRecommendClothesByIdService({ id: clothesId, cursor, take, userId: req.id, category }, Prisma);

    const isClothes = recommendClothes.length > 0;

    if (!isClothes) {
        const data = {
            cursor: cursor ?? 0,
            category,
            take,
            hasNext: false,
            nextCursor: null,
            totalCounts: countOfRecommendClothes,
            size: recommendClothes.length,
            clothes: recommendClothes
        };
        res.json(data);
        return;
    }
    const lastRecommendClothes = recommendClothes[recommendClothes.length - 1];

    const data = {
        cursor: cursor ?? 0,
        category: category || "All",
        take,
        hasNext: lastRecommendClothes.id > (lastRecommendAllClothes?.id ?? 0),
        nextCursor: lastRecommendClothes.id,
        totalCounts: countOfRecommendClothes,
        size: recommendClothes.length,
        clothes: recommendClothes
    };

    res.json(data);
};
