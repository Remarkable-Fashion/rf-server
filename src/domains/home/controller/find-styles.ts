import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { findStylesService } from "../service";


export const findStylesController = async (req: Request<unknown, unknown>, res: Response) => {

    const styles = await findStylesService(Prisma);

    res.status(200).json(styles);
};
