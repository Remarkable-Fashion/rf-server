import { Role } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../lib/http-error";
import { verify } from "../lib/jwt";
import { UserWithRole } from "../@types/express";

export const authJWT = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        throw new UnauthorizedError("No Authorized!");
    }

    const token = req.headers.authorization.split("Bearer ")[1];
    const result = verify(token);

    if (!result.ok) {
        throw new UnauthorizedError(result.message);
    }
    req.id = result.id;
    // req.user.id = result.id;
    next();
};

export const authRole = (role: Role) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new Error("Check Your Login Session");
    }
    if (role !== req.user.role) {
        throw new UnauthorizedError(`You Should be ${role}`);
    }
    next();
};

export const authTest = (id?: number) => (req: Request, res: Response, next: NextFunction) => {
    req.user = {
        id: id ?? 1,
        name: "test",
        email: "test@gmail.com",
        role: "User",
        type: "Kakao"
    } as unknown as UserWithRole;
    req.id = req.user.id;
    next();
};
