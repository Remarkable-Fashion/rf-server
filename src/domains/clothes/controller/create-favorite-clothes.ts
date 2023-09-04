import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { createFavoirteClothesService } from "../service/create-favorite-clothes";
import { redisClient } from "../../../db/redis";
import { COUNTS_CLOTHES_LIKES_PREFIX } from "../../../constants";

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

export const createFavoriteClothes = async (req: Request<{ id?: string }, unknown, unknown>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const clothesId = validateParamClothesId(req.params.id);

    await createFavoirteClothesService(clothesId, req.id, Prisma);

    const key = `${COUNTS_CLOTHES_LIKES_PREFIX}:${clothesId}`;

    await redisClient.incrBy(key, 1);

    res.json({
        success: true,
        msg: "Success create clothes favorite"
    });
};
