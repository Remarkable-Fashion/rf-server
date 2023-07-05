import type { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { logger } from "../logger";
import { HttpError } from "../lib/http-error";

export const dbErrorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof PrismaClientKnownRequestError) {
        // console.log("err :", err);
        // console.log("err :", err.message);
        // console.log("err :", err.stack);
        // console.log("err.code :", err.code);
        // console.log("err.meta :", err.meta);
        res.status(400);
        switch (err.code) {
            case "P2002":
                res.json({ msg: "Record already exist" });
                break;

            case "P2003":
                res.json({ msg: "Foreign key constraint failed on the field" });
                break;

            case "P2025":
                res.json({ msg: "Record to delete does not exist" });
                break;

            default:
                res.json({ msg: err.message });
                break;
        }

        logger.error({ req, res });
        // res.status(400);
    } else {
        next(err);
    }
};

export const errorMiddleware = (err: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error({ req, res });
    console.log("error :", err);
    // res.status(500);

    if (err instanceof HttpError) {
        res.status(err.status);
        res.json({ msg: err.message });
    } else {
        // console.log("err :", err);
        res.status(500).json({ msg: err.message || "error" });
    }
};
