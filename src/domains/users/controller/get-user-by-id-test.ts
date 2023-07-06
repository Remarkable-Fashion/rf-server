import { Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/http-error";
import {getUserWithProfileById as getUserWithProfileByIdService} from "../service/get-user-with-profile-by-id";
import Prisma from "../../../db/prisma";

export const getUserByIdTest = async (req: Request, res: Response) => {

    // if(!req.id){
    //     throw new UnauthorizedError()
    // }

    const user = await getUserWithProfileByIdService({id: 5}, Prisma);
    res.json(user);
}