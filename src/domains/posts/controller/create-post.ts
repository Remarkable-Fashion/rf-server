import TSON from "typescript-json";
import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { createPost as createPostService } from "../service/create-post";
import { Clothes } from "../types";
import { BadReqError } from "../../../lib/http-error";
import { conf } from "../../../config";

type ReqBody = {
    title: string;
    description: string;
    // imgUrls: string[];
    clothes?: Clothes[];
};

export const createPost = async (req: Request<unknown, unknown, ReqBody>, res: Response) => {
    const { success, errors } = TSON.validate<ReqBody>(req.body);
    if (!success) {
        throw new BadReqError(TSON.stringify(errors));
    }

    // if (!(req.body.imgUrls.length > 0)) {
    //     throw new BadReqError("imgUrls required");
    // }

    // @Check this issue : https://stackoverflow.com/questions/57631753/how-to-properly-handle-req-files-in-node-post-request-using-multer-and-typescrip#answer-70799312
    // const files = (req.files as { [fieldName: string]: Express.Multer.File[]}).images
    const imgUrls = (req.files as { [fieldName: string]: Express.Multer.File[]}).images
        .map(f=> conf().CLIENT_DOMAIN + f.filename)

    if(!imgUrls || imgUrls.length < 1){
        throw new BadReqError("There must be at least one image");
    }
    
    const data = { userId: req.id, ...req.body, imgUrls };
    const post = await createPostService(data, Prisma);

    res.status(200).json(post);
};
