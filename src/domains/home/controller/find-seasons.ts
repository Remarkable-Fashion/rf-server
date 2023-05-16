import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { findSeasonsService} from "../service";


export const findSeasonsController = async (req: Request<unknown, unknown>, res: Response) => {

    const seasons = await findSeasonsService(Prisma);

    res.status(200).json(seasons);
};
