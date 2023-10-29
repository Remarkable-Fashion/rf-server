import type { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HttpError } from "../lib/http-error";

export const dbErrorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof PrismaClientKnownRequestError) {
        res.status(400);
        switch (err.code) {
            case "P2002":
                res.json({
                    success: false,
                    msg: "Record already exist"
                });
                break;

            case "P2003":
                res.json({
                    success: false,
                    msg: "Foreign key constraint failed on the field"
                });
                break;

            case "P2025":
                res.json({
                    success: false,
                    msg: "Record to delete does not exist"
                });
                break;

            default:
                res.json({
                    success: false,
                    msg: err.message
                });
                break;
        }

        // res.status(400);
    } else {
        next(err);
    }
};

export const errorMiddleware = (err: any, req: Request, res: Response, _next: NextFunction) => {

    if (err instanceof HttpError) {
        res.status(err.status);
        res.json({
            success: false,
            msg: err.message
        });
    } else {
        // console.log("err :", err);
        res.status(500).json({
            success: false,
            msg: err.message || "No error msg"
        });
    }
};
