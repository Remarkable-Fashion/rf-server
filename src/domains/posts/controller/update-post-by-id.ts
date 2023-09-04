import type { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { updatePostByIdService } from "../service/update-post-by-id";

type ReqParams = {
    id?: string;
};

export const updatePostById = async (req: Request<ReqParams>, res: Response) => {
    const { id } = req.params;

    const parsedId = Number(id);

    if (!id || Number.isNaN(parsedId)) {
        throw new BadReqError("Check id");
    }

    if (!req.id) {
        throw new UnauthorizedError();
    }

    await updatePostByIdService({ postId: parsedId }, Prisma);

    res.json({
        success: true,
        msg: "Success update post"
    });
};
