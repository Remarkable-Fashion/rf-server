import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { createFavorite as createFavoriteService } from "../service/create-favorite";
import { BadReqError } from "../../../lib/http-error";
import { redisClient } from "../../../db/redis";
import { COUNTS_POST_LIKES_PREFIX, COUNTS_POST_LIKES_STREAM } from "../../../constants";

type ReqParam = {
    id?: string;
};

export const createFavorite = async (req: Request<ReqParam, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No Params");
    }

    const postId = Number(req.params.id);

    const data = { userId: req.id, postId };
    await createFavoriteService(data, Prisma);

    const key = `${COUNTS_POST_LIKES_PREFIX}:${postId}`;

    await redisClient.multi().incrBy(key, 1).XADD(COUNTS_POST_LIKES_STREAM, "*", {post_id: req.params.id}).exec();

    // redisClient.executeIsolated
    // redisClient.lock

    // await redisClient.incrBy(key, 1);
    // await redisClient.XADD("likes:stream", "*", {post_id: req.params.id})

    res.status(200).json({
        success: true,
        msg: "Success create favorite"
    });
    // res.status(200).json(favorite);
};
