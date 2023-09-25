import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { deleteFollowingService } from "../service/delete-following";

export const deleteFollower = async (req: Request<{ id?: string }, unknown, unknown>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const followerId = Number(req.params.id);

    if (req.id === followerId) {
        throw new BadReqError("Could not self delete following");
    }

    // follower, following 삭제 메커니즘 같아서 그대로 사용.
    await deleteFollowingService({ followerId: followerId, followingId: req.id }, Prisma);
    res.json({
        success: true,
        msg: "Success delete follower"
    });
    // res.json(following);
};
