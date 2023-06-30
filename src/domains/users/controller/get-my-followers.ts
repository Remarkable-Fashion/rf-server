import { Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getMyFollowersService } from "../service/get-my-followers";

export const getMyFollowers = async (req: Request, res: Response) => {

    if(!req.id){
        throw new UnauthorizedError()
    }

    const followers = await getMyFollowersService({userId: req.id }, Prisma);
    res.json(followers.map( ({follower}) => ({...follower})));
}