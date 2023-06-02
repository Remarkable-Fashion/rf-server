import { Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/http-error";
import {getUserWithProfileById as getUserWithProfileByIdService} from "../service/get-user-with-profile-by-id";
import Prisma from "../../../db/prisma";

export const getUserById = async (req: Request<{id?: string}, unknown, unknown>, res: Response) => {

    if(req.user?.id !== Number(req.params.id)){
        throw new UnauthorizedError()
    }

    const id = Number(req.params.id);


    const user = await getUserWithProfileByIdService({id}, Prisma);
    res.json(user);
}