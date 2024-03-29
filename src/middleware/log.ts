import type { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        const logLevel = res.statusCode >= 400 ? 'error' : 'info';
        logger[logLevel]({ req, res });
    })
    next();
};
