import type { Request, Response, NextFunction } from "express";
import { verify } from "../lib/jwt";

export const authJWT = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        throw new Error("No Authorized!");
    }

    const token = req.headers.authorization.split("Bearer ")[1];
    const result = verify(token);

    if (!result.ok) {
        throw new Error(result.message);
    }

    req.id = result.id!;
    next();
};
