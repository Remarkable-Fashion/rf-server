import { Request, Response } from "express";
import typia from "typia";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { NotNullCreateRecommendClothes, createRecommendClothesService } from "../service/create-recommend-clothes";
import { validateBody } from "../../../lib/validate-body";

export const createRecommendClothes = async (req: Request<{ id?: string }, unknown, unknown>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const clothesId = validateParamClothesId(req.params.id);

    const body = validateBody(typia.createValidateEquals<NotNullCreateRecommendClothes>())(req.body);

    const recommendClothes = await createRecommendClothesService(clothesId, req.id, body, Prisma);

    res.json({
        success: true,
        msg: "Success create clothes"
    });
    // res.json({ clothes: recommendClothes });
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
