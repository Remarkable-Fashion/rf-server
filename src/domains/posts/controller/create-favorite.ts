import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { createFavorite as createFavoriteService } from "../service/create-favorite";
import { BadReqError } from "../../../lib/http-error";
import { redisClient } from "../../../db/redis";
import { COUNTS_POST_LIKES_PREFIX } from "../../../constants";

type ReqParam = {
    id?: string;
};

export const createFavorite = async (req: Request<ReqParam, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No Params");
    }

    const postId = Number(req.params.id);

    const data = { userId: req.id, postId };
    const favorite = await createFavoriteService(data, Prisma);

    
    const key = `${COUNTS_POST_LIKES_PREFIX}:${postId}`;

    await redisClient.incrBy(key, 1);

    res.status(200).json({
        success: true,
        msg: "Success create favorite"
    });
    // res.status(200).json(favorite);
};
