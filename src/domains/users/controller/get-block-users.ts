import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getBlockUsersService } from "../service/get-block-users";

export const getBlockUsers = async (req: Request, res: Response) => {

    if(!req.id){
        throw new UnauthorizedError()
    }

    const blokedUsers = await getBlockUsersService({userId: req.id}, Prisma);
    res.json(blokedUsers.map(({blocked}) => ({...blocked})));
}