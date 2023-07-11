import { Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { checkFollowingService } from "../service/check-following";

export const checkFollowing = async (req: Request<{ id?: string }, unknown, unknown>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const followingId = Number(req.params.id);

    const following = await checkFollowingService({ followerId: req.id, followingId }, Prisma);

    // const isFollowing = !!following;
    res.json({ following: !!following });
};
