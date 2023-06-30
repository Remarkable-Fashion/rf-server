import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { deleteScrap as deleteScrapService } from "../service/delete-scrap";

type ReqParams = {
    id?: string;
    // scrapId?: string;
};
export const deleteScrap = async (req: Request<ReqParams, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No post id OR favorite id");
    }

    const scrap = await deleteScrapService({ userId: Number(req.id), postId: Number(req.params.id) }, Prisma);

    res.status(200).json(scrap);
};
