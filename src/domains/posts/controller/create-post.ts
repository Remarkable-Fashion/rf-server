import type { Request, Response } from "express";
import TSON from "typia";
import Prisma from "../../../db/prisma";
import { CreatePost, createPost as createPostService, CreatePostBody } from "../service/create-post";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import { validateBody } from "../../../lib/validate-body";

export const createPost = async (req: Request<unknown, unknown, CreatePostBody>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError("Check your user");
    }
    const body = validateBody(TSON.createValidateEquals<CreatePostBody>())(req.body);

    const sex = body.sex;
    if (!sex) {
        throw new BadReqError("Check your user profile field, sex");
    }

    const data: CreatePost = { userId: req.id, ...body, sex: sex };
    await createPostService(data, Prisma);

    res.status(200).json({
        success: true,
        msg: "Success create post"
        // post: post
    });
};
