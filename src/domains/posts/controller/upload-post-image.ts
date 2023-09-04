import type { Request, Response } from "express";
import { CreatePostBody } from "../service/create-post";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import { conf } from "../../../config";
import { createTmpImagesService } from "../service/create-tmp-images";
import Prisma from "../../../db/prisma";

export const uploadPostImage = async (req: Request<unknown, unknown, CreatePostBody>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError("Check your user");
    }
    const imgUrls = (req.files as { [fieldName: string]: Express.Multer.File[] }).posts.map((f) => `${conf().S3_BUCKET_URL}/${f.filename || f.key}`);

    if (!imgUrls || imgUrls.length < 1) {
        throw new BadReqError("There must be at least one image");
    }

    await createTmpImagesService(imgUrls, Prisma);

    res.status(200).json({
        success: true,
        msg: "Success upload post images",
        imgUrls
    });
};
