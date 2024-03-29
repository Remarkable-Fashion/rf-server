import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { COUNTS_CLOTHES_LIKES_PREFIX, COUNTS_CLOTHE_LIKES_STREAM } from "../../../constants";
import { RedisSingleton } from "../../../db/redis";
import { deleteFavoriteClothesService } from "../service/delete-favorite-clothes";

type ReqParams = {
    id?: string;
};
export const deleteFavoriteClothes = async (req: Request<ReqParams, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No clothes id");
    }

    const clothesId = Number(req.params.id);
    await deleteFavoriteClothesService({ userId: Number(req.id), clothesId }, Prisma);

    const key = `${COUNTS_CLOTHES_LIKES_PREFIX}:${clothesId}`;

    // await redisClient.decrBy(key, 1);
    await (await RedisSingleton.getClient()).multi().decrBy(key, 1).XADD(COUNTS_CLOTHE_LIKES_STREAM, "*", {clothe_id: String(clothesId)}).exec();

    res.json({
        success: true,
        msg: "Success delete clothes favorite"
    });
};
