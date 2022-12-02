import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { createFavorite as createFavoriteService } from "../service/create-favorite";
import { BadReqError } from "../../../lib/http-error";

type ReqParam = {
    id?: string;
};

export const createFavorite = async (req: Request<ReqParam, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No Params");
    }

    const data = { userId: req.id, postId: Number(req.params.id) };
    const post = await createFavoriteService(data, Prisma);

    res.status(200).json(post);
};
