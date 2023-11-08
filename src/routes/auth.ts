import { Router, type Request, type Response, NextFunction } from "express";
import axios from "axios";
import passport from "passport";
import prisma from "../db/prisma";
import { RedisSingleton } from "../db/redis";
import { refreshJwt } from "../domains/auth/controller/refresh-jwt";
import { controllerHandler } from "../lib/controller-handler";
import { refresh, sign } from "../lib/jwt";
import { BadReqError, HttpError, UnauthorizedError } from "../lib/http-error";
// import { authRole } from "../middleware/auth";
import { KakaoStrategyError } from "../passports/kakao-strategy";
import { loginKakao } from "../domains/auth/controller/kakao-login";
import { conf } from "../config";
import { createSocialService } from "../domains/users/service/create-social";
import { GOOGLE_CONNECT_STRATEGY, GOOGLE_LOGIN_STRATEGY, KAKAO_CONNECT_STRATEGY, KAKAO_LOGIN_STRATEGY } from "@/constants";
import { authJWT, checkUserType, isNotLogin } from "@/middleware/auth";

const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 14; // 2주

const BASE_URL = "https://chore-comment.rf-server-static.pages.dev";
// const BASE_URL = conf().CLIENT_DOMAIN;

function socialHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err && err instanceof HttpError) {
        console.error(err);
        res.redirect(`${BASE_URL}/login/fail?message=${err.message}`);
        return;
    }
    next();
}
function setCookieMobile() {
    return async (req: Request, res: Response) => {
        console.log("## IN setCookieMobile");
        const id = req.id || req.user?.id;
        if (!id) {
            throw new UnauthorizedError("No User");
        }

        const user = { id: id };

        const accessToken = sign(user);
        const refreshToken = refresh();
        (await RedisSingleton.getClient()).SET(String(id), refreshToken, { EX: REFRESH_TOKEN_EXPIRES });

        res.setHeader("x-auth-cookie", accessToken);
        res.setHeader("x-auth-cookie-refresh", refreshToken);
        // res.cookie("x-auth-cookie", accessToken);
        // res.cookie("x-auth-cookie-refresh", refreshToken);

        // res.redirect(conf().CLIENT_DOMAIN);
        res.json({ success: true });
    };
}

function setCookieAndRedirectWeb() {
    return async (req: Request, res: Response) => {
        const id = req.id || req.user?.id;
        if (!id) {
            console.error("No User");
            res.redirect(`${BASE_URL}/login/fail`);
            return;
        }

        const user = { id };

        const accessToken = sign(user);
        const refreshToken = refresh();
        (await RedisSingleton.getClient()).SET(String(id), refreshToken, { EX: REFRESH_TOKEN_EXPIRES });

        res.cookie("x-auth-cookie", accessToken, { httpOnly: true, sameSite: "none", secure: true });
        res.cookie("x-auth-cookie-refresh", refreshToken, { httpOnly: true, sameSite: "none", secure: true });

        res.redirect(`${BASE_URL}/login/success`);
    };
}

function setCookieAndRedirectWebConnect() {
    return async (req: Request, res: Response) => {
        const id = req.id || req.user?.id;
        const addedAccount = (req as any).account;
        const keys = Object.keys(addedAccount.token);
        req.token = req.token || {};
        req.token[keys[0]] = addedAccount.token[keys[0]];
        if (!id) {
            console.error("No User");
            res.redirect(`${BASE_URL}/login/fail`);
            return;
        }

        if (!addedAccount.social) {
            await createSocialService({ userId: id, type: addedAccount.type, socialId: addedAccount.socialId }, prisma);
        } else if (id === addedAccount.social.user_id) {
            console.error(`${addedAccount.type}은 이미 회원가입되어 있습니다.`);
            res.redirect(`${BASE_URL}/login/fail`);
            return;
        }
        res.redirect("https://chore-comment.rf-server-static.pages.dev/login/success");
    };
}

const authRouter = Router();

authRouter.get("/refresh", controllerHandler(refreshJwt));

authRouter.get("/kakao", controllerHandler(loginKakao), setCookieMobile());

authRouter.get("/connect/kakao-t", authJWT, checkUserType("Kakao"), passport.authorize(KAKAO_CONNECT_STRATEGY), socialHandler);
authRouter.get(
    "/connect/kakao-t/callback",
    passport.authorize(KAKAO_CONNECT_STRATEGY, {
        failureRedirect: `${BASE_URL}/login/fail`
    }),
    socialHandler,
    setCookieAndRedirectWebConnect()
);

authRouter.get("/kakao-t", isNotLogin, passport.authenticate(KAKAO_LOGIN_STRATEGY), socialHandler);
authRouter.get(
    "/kakao-t/callback",
    passport.authenticate(KAKAO_LOGIN_STRATEGY, {
        failureRedirect: `${BASE_URL}/login/fail`
    }),
    socialHandler,
    setCookieAndRedirectWeb()
);

authRouter.get(
    "/connect/google-t",
    authJWT,
    checkUserType("Google"),
    passport.authorize(GOOGLE_CONNECT_STRATEGY, { scope: ["profile", "email"] }),
    socialHandler
);
authRouter.get(
    "/connect/google-t/callback",
    passport.authorize(GOOGLE_CONNECT_STRATEGY, {
        failureRedirect: `${BASE_URL}/login/fail`
    }),
    socialHandler,
    setCookieAndRedirectWebConnect()
);

authRouter.get("/google-t", isNotLogin, passport.authenticate(GOOGLE_LOGIN_STRATEGY, { scope: ["profile", "email"] }), socialHandler);
authRouter.get(
    "/google-t/callback",
    passport.authenticate(GOOGLE_LOGIN_STRATEGY, {
        failureRedirect: `${BASE_URL}/login/fail`
    }),
    socialHandler,
    setCookieAndRedirectWeb()
);

authRouter.get(
    "/logout",
    controllerHandler(async (req: Request, res: Response) => {
        const KAKAO_ACCESS_TOKEN = req.user?.token.kakao || req.flash(KakaoStrategyError)[0] || req.token?.kakao;
        const GOOGLE_ACCESS_TOKEN = req.user?.token.google || req.token?.google;
        // const KAKAO_ACCESS_TOKEN = req.user?.accessToken || req.flash(KakaoStrategyError)[0];
        // console.log("KAKAO_ACCESS_TOKEN :", KAKAO_ACCESS_TOKEN);
        if (KAKAO_ACCESS_TOKEN) {
            // console.log("카카오 로그아웃");
            await axios({
                method: "POST",
                url: "https://kapi.kakao.com/v1/user/unlink",
                headers: {
                    Authorization: `Bearer ${KAKAO_ACCESS_TOKEN}`
                }
            });
        }

        if (GOOGLE_ACCESS_TOKEN) {
            // console.log("구글 로그아웃");
            await axios({
                method: "POST",
                url: "https://accounts.google.com/o/oauth2/revoke",
                // headers: {
                //     Authorization: `Bearer ${KAKAO_ACCESS_TOKEN}`
                // }
                data: {
                    token: GOOGLE_ACCESS_TOKEN
                }
            });
        }

        const id = req.id || req.user?.id;
        /**
         * @info 모바일과 웹 클라가 같은 이름의 토큰을 사용 중.
         */
        if (id) {
            (await RedisSingleton.getClient()).DEL(String(id));
        }
        req.logOut((error) => {
            if (error) {
                throw new BadReqError(error);
            }
        });
        // { httpOnly: true, sameSite: "none", secure: true }

        res.cookie("x-auth-cookie", "", { httpOnly: true, sameSite: "none", secure: true, expires: new Date(0) });
        res.cookie("x-auth-cookie-refresh", "", { httpOnly: true, sameSite: "none", secure: true, expires: new Date(0) });

        res.status(204).send("ok");
        // res.redirect(conf().CLIENT_DOMAIN);
    })
);

export { authRouter };
