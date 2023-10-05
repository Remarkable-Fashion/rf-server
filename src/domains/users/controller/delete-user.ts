import { Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { deleteUserService } from "../service/delete-user";

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.id;
    if (!userId) {
        throw new UnauthorizedError();
    }

    await deleteUserService({userId}, Prisma);
    res.status(200).json({
        success: true,
        msg: "Success soft delete user"
    });
};
