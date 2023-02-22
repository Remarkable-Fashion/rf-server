import { Request, Response } from "express";
import TSON from "typescript-json";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import {Profile} from "@prisma/client"
import {updateUser as updateUserService} from "../service/update-user"

type UpdateProfile = Pick<Profile, "sex" | "height" | "weight" | "introduction">;

export const updateUser = async (req: Request<{id: string}, unknown, unknown>, res: Response) => {

    if(req.user?.id !== Number(req.params.id)){
        throw new UnauthorizedError()
    }

    const { success, errors } = TSON.validate<UpdateProfile>(req.body);
    if (!success) {
        throw new BadReqError(TSON.stringify(errors));
    }
    
    const user = await updateUserService(req.body);
    res.json(user);
}