import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { deleteFavorite as deleteFavoriteService } from "../service/delete-favorite";

type ReqParams = {
    id?: string;
    // favoriteId?: string;
};
export const deleteFavorite = async (req: Request<ReqParams, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No post id OR favorite id");
    }

    const favorite = await deleteFavoriteService(
        { userId: Number(req.id), postId: Number(req.params.id) },
        // { userId: Number(req.id), postId: Number(req.params.id), favoriteId: Number(req.params.favoriteId) },
        Prisma
    );

    res.json(favorite);
};
