import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { getMyFavoritesService } from "../service/get-my-favorites";

const DEFAULT_TAKE = 21;

export const getMyFavorites = async (req: Request, res: Response) => {

    // 다음에 읽을 postId
    const _cursor = req.query.cursorId;
    const _take = req.query.take;

    const cursor = _cursor ? Number(_cursor) : 0;
    if(cursor && cursor < 0){
        throw new BadReqError("cursor should be higher than 0")
    }
    const take = _take ? Number(_take) : DEFAULT_TAKE;

    const data = { userId: req.id, cursor, take };
    const post = await getMyFavoritesService(data, Prisma);

    res.status(200).json(post);
};
