import { Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/http-error";
import { getUserWithProfileById as getUserWithProfileByIdService } from "../service/get-user-with-profile-by-id";
import Prisma from "../../../db/prisma";

export const getUserById = async (req: Request, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const id = req.params.id === "me" ? req.id : Number(req.params.id);

    const user = await getUserWithProfileByIdService({ id }, Prisma);
    res.json(user);
};
