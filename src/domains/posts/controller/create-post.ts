import TSON from "typescript-json";
import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { createPost as createPostService } from "../service/create-post";
import { Clothes } from "../types";
import { BadReqError } from "../../../lib/http-error";

type ReqBody = {
    title: string;
    description: string;
    imgUrls: string[];
    clothes?: Clothes[];
};

export const createPost = async (req: Request<unknown, unknown, ReqBody>, res: Response) => {
    const { success, errors } = TSON.validate<ReqBody>(req.body);
    if (!success) {
        throw new BadReqError(TSON.stringify(errors));
    }

    if (!(req.body.imgUrls.length > 0)) {
        throw new BadReqError("imgUrls required");
    }

    const data = { userId: req.id, ...req.body };
    const post = await createPostService(data, Prisma);

    res.status(200).json(post);
};
