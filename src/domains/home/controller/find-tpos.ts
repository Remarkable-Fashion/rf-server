import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { findTposService } from "../service";

export const findTposController = async (req: Request<unknown, unknown>, res: Response) => {

    const tpos = await findTposService(Prisma);

    const tpoList = tpos.map(tpo => tpo.tpo);

    res.status(200).json(tpoList);
};
