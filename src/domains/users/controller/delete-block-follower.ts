import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { deleteBlockFollowerService } from "../service/delete-block-follower";

/**
 * @TODO 팔로우 삭제가 아닌 차단으로.
 * @param req 
 * @param res 
 */
export const deleteBlockFollower = async (req: Request<{id?: string}, unknown, unknown>, res: Response) => {

    if(!req.id){
        throw new UnauthorizedError()
    }

    const _blockedId = req.params.id;

    if(!_blockedId){
        throw new BadReqError();
    }

    const blockedId = Number(_blockedId);

    if(req.id === blockedId){
        throw new BadReqError("Could not self delete block");
    }

    const follower = await deleteBlockFollowerService({blockerId: req.id, blockedId }, Prisma);
    res.json(follower);
}