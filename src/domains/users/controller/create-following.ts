import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { createFollowingService } from "../service/create-following";

export const createFollowing = async (req: Request<{id?: string}, unknown, unknown>, res: Response) => {

    if(!req.id){
        throw new UnauthorizedError()
    }

    const followingId = Number(req.params.id);

    if(req.id === followingId){
        throw new BadReqError("Could not self following");
    }

    const following = await createFollowingService({followerId: req.id, followingId }, Prisma);
    res.json(following);
}