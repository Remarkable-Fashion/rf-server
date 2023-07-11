import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { createScrapClothesByIdService } from "../service/create-scrap-clothes";
import { conf } from "../../../config";

type ReqParam = {
    id?: string;
};

export const uploadClthesImages = async (req: Request<ReqParam, unknown>, res: Response) => {
    const imgUrls = (req.files as { [fieldName: string]: Express.Multer.File[] }).images.map((f) => `${conf().SERVER_DOMAIN}/${f.filename}`);

    if (!imgUrls || imgUrls.length < 1) {
        throw new BadReqError("There must be at least one image");
    }

    // const data = { userId: req.id, clothesId: Number(req.params.id) };
    // const scrap = await createScrapClothesByIdService(data, Prisma);

    res.status(200).json({msg: "test", images: imgUrls});
};
