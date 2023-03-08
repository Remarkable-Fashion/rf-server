import { Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import {UpdateProfile, updateUser as updateUserService} from "../service/update-user"
import TSON from "typia"
import { validateBody } from "../../../lib/validate-body";

export const updateUser = async (req: Request<{id: string}, unknown, unknown>, res: Response) => {

    if(req.user?.id !== Number(req.params.id)){
        throw new UnauthorizedError()
    }

    const rv = validateBody(TSON.createValidateEquals<UpdateProfile>())(req.body)

    const user = await updateUserService(req.user.id, rv, Prisma);
    res.json(user);
}