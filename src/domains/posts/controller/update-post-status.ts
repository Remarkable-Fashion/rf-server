import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { updatePostStatusService } from "../service/update-post-status";

type ReqParam = {
    id?: string;
};

export const updatePostStatus = async (req: Request<ReqParam, unknown, { isPublic: boolean }, unknown>, res: Response) => {
    if (!req.params.id) {
        throw new BadReqError("No Params");
    }

    const postId = Number(req.params.id);

    const isPublic = req.body.isPublic;

    const data = { isPublic, postId };
    await updatePostStatusService(data, Prisma);

    res.status(200).json({
        success: true,
        msg: `Success update post status : ${isPublic}`
    });
};
