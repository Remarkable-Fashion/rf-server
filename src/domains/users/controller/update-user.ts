import { Request, Response } from "express";
import TSON from "typia";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { validateBody } from "../../../lib/validate-body";
import { UpdateUser, updateUserService } from "../service/update-user";

export const updateUser = async (req: Request, res: Response) => {
    const userId = req.id;
    if (!userId) {
        throw new UnauthorizedError();
    }

    const body = Object.keys(req.body);
    if (!body.length) {
        throw new BadReqError("Check your body");
    }
    const data = validateBody(TSON.createValidateEquals<UpdateUser>())(req.body);

    await updateUserService(userId, { ...data }, Prisma);
    res.status(204).json();
};
