import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { createScrapClothesByIdService } from "../service/create-scrap-clothes";

type ReqParam = {
    id?: string;
};

export const createScrapClothesById = async (req: Request<ReqParam, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No Params");
    }

    const data = { userId: req.id, clothesId: Number(req.params.id) };
    await createScrapClothesByIdService(data, Prisma);

    res.status(200).json({
        success: true,
        msg: "Success create scrap"
    });
    // res.status(200).json(scrap);
};
