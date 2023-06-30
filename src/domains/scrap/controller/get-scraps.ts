import { Request, Response } from "express";
import TSON from "typia";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { getScraps as getScrapsService } from "../service/get-scraps";

type ReqQuerys = {
    take?: string;
    cursorId?: string;
};

const DEFAULT_TAKE = 12;
const DEFAULT_CURSUR = 1;

export const getScraps = async (req: Request<unknown, unknown, unknown, ReqQuerys>, res: Response) => {
    const result = TSON.validate<ReqQuerys>(req.params);
    // const { success, errors } = TSON.validate<{ take: number; cursorId: number }>(req.params);
    if (!result.success) {
        throw new BadReqError(TSON.stringify(result.errors));
    }

    

    // const take = req.query.take ? Number(req.query.take) : DEFAULT_TAKE;
    const take = result.data.take ? Number(result.data.take) : DEFAULT_TAKE;
    // const cursorId = req.query.cursorId ? Number(req.query.cursorId) : DEFAULT_CURSUR;
    const cursorId = result.data.cursorId ? Number(result.data.cursorId) : undefined;

    const scraps = await getScrapsService({ cursorId, take, userId: Number(req.id) }, Prisma);

    res.status(200).json(scraps);
};
