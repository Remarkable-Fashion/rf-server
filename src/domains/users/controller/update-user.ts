import { Request, Response } from "express";
import TSON from "typia";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import {UpdateProfile, updateUser as updateUserService} from "../service/update-user"

export const updateUser = async (req: Request<{id: string}, unknown, unknown>, res: Response) => {

    if(req.user?.id !== Number(req.params.id)){
        throw new UnauthorizedError()
    }

    const rv = TSON.validateEquals<UpdateProfile>(req.body);
    if (!rv.success) {
        throw new BadReqError(TSON.stringify(rv.errors));
    }
    
    const user = await updateUserService(req.user.id, rv.data, Prisma);
    res.json(user);
}