import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { deleteBlockUserService } from "../service/delete-block-follower";

/**
 * @TODO 팔로우 삭제가 아닌 차단으로.
 * @param req
 * @param res
 */
export const deleteBlockUser = async (req: Request<{ id?: string }, unknown, unknown>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const blockedIdT = req.params.id;

    if (!blockedIdT) {
        throw new BadReqError();
    }

    const blockedId = Number(blockedIdT);

    if (req.id === blockedId) {
        throw new BadReqError("Could not self delete block");
    }

    await deleteBlockUserService({ blockerId: req.id, blockedId }, Prisma);
    res.json({
        success: true,
        msg: "Success delete block_user"
    });
    // res.json(follower);
};
