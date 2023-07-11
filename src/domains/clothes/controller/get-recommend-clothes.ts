import { Request, Response } from "express";
import { ClothesCategory } from "@prisma/client";
import typia from "typia";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getRecommendClothesByIdService } from "../service/get-recommend-clothes";
import { validateBody } from "../../../lib/validate-body";

export const getRecommendClothesById = async (req: Request<{ id?: string }, unknown, unknown, { category?: string }>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const category = validateQueryCategory(req.query.category);

    const clothesId = validateParamClothesId(req.params.id);
    const [recommendClothes] = await getRecommendClothesByIdService(clothesId, req.id, category, Prisma);

    const data = {
        size: recommendClothes.length,
        category,
        clothes: recommendClothes
    };

    res.json(data);
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

const validateQueryCategory = (category?: string) => {
    if (!category) {
        throw new BadReqError("Query string 'category' shoul be");
    }

    return validateBody(typia.createValidateEquals<ClothesCategory>())(category);
};
