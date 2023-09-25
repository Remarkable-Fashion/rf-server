import type { Request, Response } from "express";
import TSON from "typia";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { updatePostByIdService, UpdatePostBody } from "../service/update-post-by-id";
import { validateBody } from "../../../lib/validate-body";

type ReqParams = {
    id?: string;
};

export const updatePostById = async (req: Request<ReqParams, UpdatePostBody>, res: Response) => {
    const { id } = req.params;

    const parsedId = Number(id);

    if (!id || Number.isNaN(parsedId)) {
        throw new BadReqError("Check id");
    }

    // const body = validateBody(UpdatePostBody)
    const body = validateBody(TSON.createValidateEquals<UpdatePostBody>())(req.body);

    if (!req.id) {
        throw new UnauthorizedError();
    }

    await updatePostByIdService({ postId: parsedId, data: body }, Prisma);

    res.json({
        success: true,
        msg: "Success update post"
    });
};
