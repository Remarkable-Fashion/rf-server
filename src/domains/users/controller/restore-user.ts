import { Request, Response } from "express";
// import { UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { restoreUserService } from "../service/restore-user";

export const restoreUser = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    // const userId = req.id;
    // if (!userId) {
    //     throw new UnauthorizedError();
    // }

    await restoreUserService({userId}, Prisma);
    res.status(200).json({
        success: true,
        msg: "Success restore user"
    });
};
