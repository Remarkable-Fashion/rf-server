import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { deleteFollowingService } from "../service/delete-following";

export const deleteFollowing = async (req: Request<{ id?: string }, unknown, unknown>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const followingId = Number(req.params.id);

    if (req.id === followingId) {
        throw new BadReqError("Could not self delete following");
    }

    await deleteFollowingService({ followerId: req.id, followingId }, Prisma);
    res.json({
        success: true,
        msg: "Success delete following"
    });
    // res.json(following);
};
