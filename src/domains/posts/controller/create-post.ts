import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { CreatePost, createPost as createPostService, CreatePostBody } from "../service/create-post";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import { conf } from "../../../config";
import { validateBody } from "../../../lib/validate-body";
import TSON from "typia"

export const createPost = async (req: Request<unknown, unknown, CreatePostBody>, res: Response) => {

    if(!req.user){
        throw new UnauthorizedError("Check your user")
    }

    const rv = validateBody(TSON.createValidateEquals<CreatePostBody>())(req.body)

    // if (!(req.body.imgUrls.length > 0)) {
    //     throw new BadReqError("imgUrls required");
    // }

    // @Check this issue : https://stackoverflow.com/questions/57631753/how-to-properly-handle-req-files-in-node-post-request-using-multer-and-typescrip#answer-70799312
    // const files = (req.files as { [fieldName: string]: Express.Multer.File[]}).images
    const imgUrls = (req.files as { [fieldName: string]: Express.Multer.File[] }).images.map((f) => conf().CLIENT_DOMAIN + f.filename);

    if (!imgUrls || imgUrls.length < 1) {
        throw new BadReqError("There must be at least one image");
    }

    const sex = req.body.sex || req.user.profile.sex
    if(!sex){
        throw new BadReqError("Check your user profile field, sex");
    }

    const data: CreatePost = { userId: req.id, ...rv, imgUrls, sex };
    const post = await createPostService(data, Prisma);

    res.status(200).json(post);
};
