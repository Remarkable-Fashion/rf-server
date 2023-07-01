import { Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getMyFollowingsService } from "../service/get-my-followings";

export const getMyFollowings = async (req: Request, res: Response) => {

    if(!req.id){
        throw new UnauthorizedError();
    }

    const followings = await getMyFollowingsService({userId: req.id }, Prisma);
    
    res.json(followings.map(({following}) => ({...following})));
    // res.json(followings);
}