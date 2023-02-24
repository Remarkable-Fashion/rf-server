import { Request, Response } from "express";
import TSON from "typia";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { getScraps as getScrapsService } from "../service/get-scraps";

type ReqQuerys = {
    take?: string;
    cursorId?: string;
};
export const getScraps = async (req: Request<unknown, unknown, unknown, ReqQuerys>, res: Response) => {
    const { success, errors } = TSON.validate<{ take: number; cursorId: number }>(req.params);
    if (!success) {
        throw new BadReqError(TSON.stringify(errors));
    }

    const take = req.query.take ? Number(req.query.take) : 12;
    const cursorId = req.query.cursorId ? Number(req.query.cursorId) : 1;

    const scraps = await getScrapsService({ cursorId, take, userId: Number(req.id) }, Prisma);

    res.status(200).json(scraps);
};
