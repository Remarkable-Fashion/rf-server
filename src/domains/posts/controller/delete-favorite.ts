import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { deleteFavorite as deleteFavoriteService } from "../service/delete-favorite";
import { COUNTS_POST_LIKES_PREFIX } from "../../../constants";
import { redisClient } from "../../../db/redis";

type ReqParams = {
    id?: string;
    // favoriteId?: string;
};
export const deleteFavorite = async (req: Request<ReqParams, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No post id OR favorite id");
    }

    const postId = Number(req.params.id);
    const favorite = await deleteFavoriteService(
        { userId: Number(req.id), postId },
        // { userId: Number(req.id), postId: Number(req.params.id), favoriteId: Number(req.params.favoriteId) },
        Prisma
    );

    const key = `${COUNTS_POST_LIKES_PREFIX}:${postId}`;

    await redisClient.decrBy(key, 1);

    res.json(favorite);
};
