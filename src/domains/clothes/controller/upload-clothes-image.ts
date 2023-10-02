import type { Request, Response } from "express";
import { BadReqError } from "../../../lib/http-error";
import { conf } from "../../../config";
import { createTmpImagesService } from "../../posts/service/create-tmp-images";
import { ImageType } from "@prisma/client";
import Prisma from "../../../db/prisma";

type ReqParam = {
    id?: string;
};

export const uploadClothesImages = async (req: Request<ReqParam, unknown>, res: Response) => {
    const imgUrls = (req.files as { [fieldName: string]: Express.Multer.File[] }).clothes.map(
        (f) => `${conf().COLUD_FRONT_URL}/${f.filename || f.key}`
    );

    if (!imgUrls || imgUrls.length < 1) {
        throw new BadReqError("There must be at least one image");
    }

    // const data = { userId: req.id, clothesId: Number(req.params.id) };
    // const scrap = await createScrapClothesByIdService(data, Prisma);

    await createTmpImagesService(imgUrls, ImageType.Clothes, Prisma);

    res.status(200).json({
        success: true,
        msg: "Success upload clothes images",
        imgUrls
    });
    // res.status(200).json({msg: "test", images: imgUrls});
};
