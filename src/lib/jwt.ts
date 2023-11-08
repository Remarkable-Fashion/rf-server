// import { Users } from "@prisma/client";
import jwt from "jsonwebtoken";
import { conf } from "../config";
import { RedisSingleton } from "../db/redis";
import { NotFoundError } from "./http-error";

export { jwt };

const JWT_ALGORITHM = "HS256";
const ACCESS_TOKEN_EXPIRES = "1d";
const REFRESH_TOKEN_EXPIRES = "30d";

// const THIRTY_MIN = 60 * 30;

export type JwtPayload = { id: number };

// export const sign = (user: Users, expiresIn?: string) => {
export const sign = (user: { id: number }, expiresIn?: string) => {
    const payload: JwtPayload = { id: user.id };

    return jwt.sign(payload, conf().JWT_SECRET, {
        algorithm: JWT_ALGORITHM,
        expiresIn: expiresIn || ACCESS_TOKEN_EXPIRES
    });
};

type Pass = { ok: true; id: number; exp: number };
type Fail = { ok: false; message: string };

export const verify = (token: string): Pass | Fail => {
    try {
        const decoded = jwt.verify(token, conf().JWT_SECRET) as jwt.JwtPayload;

        return { ok: true, id: decoded.id, exp: decoded.exp! };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message
        };
    }
};

// export const checkAccessTokenExp = (expTime: number) => {
//     const nowUNIXTime = new Date().getTime();

//     const diff = expTime - nowUNIXTime;

//     return diff > 0 && diff < THIRTY_MIN;
// }

export const refresh = () => {
    return jwt.sign({}, conf().JWT_SECRET, {
        algorithm: JWT_ALGORITHM,
        expiresIn: REFRESH_TOKEN_EXPIRES
    });
};

export const verifyRefresh = async (token: string, userId: string) => {
    try {
        const data = await (await RedisSingleton.getClient()).get(userId);
        if (!data) {
            throw new NotFoundError("No refresh token");
        }

        if (token !== data) {
            return {
                ok: false,
                message: "In valid refresh token"
            };
        }
        jwt.verify(token, conf().JWT_SECRET);

        // return true
        return {
            ok: true
        };
    } catch (error: any) {
        // return false
        return {
            ok: false,
            message: error.message
        };
    }
};

if (require.main === module) {
    const rv1 = jwt.sign({ id: 4 }, "devjwtsecreta", {
        algorithm: JWT_ALGORITHM,
        expiresIn: "365d"
    });

    console.log("rv :", rv1);
}
