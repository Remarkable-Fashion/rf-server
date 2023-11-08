import { Role, SocialType } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import { BadReqError, UnauthorizedError } from "../lib/http-error";
import { verify } from "../lib/jwt";
import { UserWithRole } from "../@types/express";

export const authJWT = (req: Request, res: Response, next: NextFunction) => {
   
    const cookie = req.cookies['x-auth-cookie'];
    if (!req.headers.authorization && !cookie) {
        throw new UnauthorizedError("No Authorized!");
    }

    const token = req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : cookie;
    const result = verify(token);

    if (!result.ok) {
        throw new UnauthorizedError(result.message);
    }
    req.id = result.id;
    // req.user.id = result.id;
    next();
};

/**
 * @info 로그인 user type 체크
 * 달라야 통과
 */
export const checkUserType = (type: SocialType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (type === req.user?.type) {
            throw new BadReqError(`${req.user.type}와 다른 소셜 로그인을 해야합니다.`);
        }
        next();
    }
}
/**
 * 
 * @info 로그인 상태면 통과 x
 */
export const isNotLogin = (req: Request, res: Response, next: NextFunction) => {
    if (req.id || req.user) {
        throw new BadReqError(`${req.user?.type} 로그인 되어 있습니다.`);
    }
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
