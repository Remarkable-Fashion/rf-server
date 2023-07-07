import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { createBlockFollowerService } from "../service/create-delete-follower";

/**
 * @TODO 팔로우 삭제가 아닌 차단으로.
 * @param req 
 * @param res 
 */
export const createBlockFollower = async (req: Request<{id?: string}, unknown, unknown>, res: Response) => {

    if(!req.id){
        throw new UnauthorizedError()
    }

    const _blockedId = req.params.id;

    if(!_blockedId){
        throw new BadReqError();
    }

    const blockedId = Number(_blockedId);

    if(blockedId === req.id){
        throw new BadReqError("Could not self block");
    }


    const follower = await createBlockFollowerService({blockerId: req.id, blockedId }, Prisma);
    res.json(follower);
}