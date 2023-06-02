import { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import {UpdateProfile, updateUser as updateUserService} from "../service/update-user"
import TSON from "typia"
import { validateBody } from "../../../lib/validate-body";
import { conf } from "../../../config";

export const updateUser = async (req: Request<{id?: string}, unknown, unknown>, res: Response) => {

    if(req.user?.id !== Number(req.params.id)){
        throw new UnauthorizedError()
    }

    const avartarUrls = (req.files as { [fieldName: string]: Express.Multer.File[] }).avartar.map((f) => conf().SERVER_DOMAIN + "/" + f.filename);

    if (!avartarUrls || avartarUrls.length !== 1) {
        throw new BadReqError("There must be one image");
    }

    const rv = validateBody(TSON.createValidateEquals<UpdateProfile>())(req.body)

    const user = await updateUserService(req.user.id, {...rv, avartar: avartarUrls[0]}, Prisma);
    res.json(user);
}