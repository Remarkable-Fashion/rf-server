import type { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { logger } from "../logger";

export const dbErrorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof PrismaClientKnownRequestError) {
        logger.error({ req, res });
        res.status(400).json({ msg: err.message });
    } else {
        next();
    }
};

export const errorMiddleware = (_err: unknown, req: Request, res: Response, _next: NextFunction) => {
    logger.error({ req, res });
    res.status(500).json({ msg: "error test" });
};
