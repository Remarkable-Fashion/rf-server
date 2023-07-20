import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { createFavoirteClothesService } from "../service/create-favorite-clothes";

export const createFavoriteClothes = async (req: Request<{ id?: string }, unknown, unknown>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const clothesId = validateParamClothesId(req.params.id);

    const recommendClothes = await createFavoirteClothesService(clothesId, req.id, Prisma);

    res.json({
        success: true,
        msg: "Success create favorite"
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
