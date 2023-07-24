import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { createScrap as createScrapService } from "../service/create-scrap";
import { BadReqError } from "../../../lib/http-error";

type ReqParam = {
    id?: string;
};

export const createScrap = async (req: Request<ReqParam, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No Params");
    }

    const data = { userId: req.id, postId: Number(req.params.id) };
    await createScrapService(data, Prisma);

    res.status(200).json({
        success: true,
        msg: "Success create scrap"
    });
    // res.status(200).json(scrap);
};
