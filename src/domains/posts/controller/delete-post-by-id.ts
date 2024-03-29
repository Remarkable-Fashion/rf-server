import type { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { deletePostByIdService } from "../service/delete-post-by-id";

type ReqParams = {
    id?: string;
};

export const deletePostById = async (req: Request<ReqParams>, res: Response) => {
    const { id } = req.params;

    const parsedId = Number(id);

    if (!id || Number.isNaN(parsedId)) {
        throw new BadReqError("Check id");
    }

    if (!req.id) {
        throw new UnauthorizedError();
    }

    await deletePostByIdService({ id: parsedId, userId: req.id }, Prisma);

    res.json({
        success: true,
        msg: "Success delete post"
    });
};
