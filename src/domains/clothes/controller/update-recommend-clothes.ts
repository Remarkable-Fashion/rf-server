import { Request, Response } from "express";
import typia from "typia";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { NotNullCreateRecommendClothes } from "../service/create-recommend-clothes";
import { validateBody } from "../../../lib/validate-body";
import { UpdateRecommendClothes, updateRecommendClothesService } from "../service/update-recommend-clothes";

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

export const updateRecommendClothes = async (req: Request<{ id?: string }, unknown, unknown>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const clothesId = validateParamClothesId(req.params.id);

    const body = validateBody(typia.createValidateEquals<UpdateRecommendClothes>())(req.body);

    const clothes = await updateRecommendClothesService(clothesId, req.id, body, Prisma);

    // await createClothesElasticSearchService({ index: CLOTHES_INDEX, clothes: [clothes] }, client);

    res.json({
        success: true,
        msg: "Success update clothes"
    });
    // res.json({ clothes: recommendClothes });
};
