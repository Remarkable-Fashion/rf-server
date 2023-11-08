import { Router, type Request, type Response } from "express";
import axios from "axios";
import type { UserWithRole } from "../@types/express";
import { RedisSingleton } from "../db/redis";
import { refreshJwt } from "../domains/auth/controller/refresh-jwt";
import { controllerHandler } from "../lib/controller-handler";
import { refresh, sign } from "../lib/jwt";
import { BadReqError, UnauthorizedError } from "../lib/http-error";
// import { authRole } from "../middleware/auth";
import { KakaoStrategyError } from "../passports/kakao-strategy";
import { loginKakao } from "../domains/auth/controller/kakao-login";
import passport from "passport";
import { conf } from "../config";

const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 14; // 2주
function setCookieAndRedirect() {
    return async (req: Request, res: Response) => {
        const id = req.id || req.user?.id;
        if (!id) {
            throw new UnauthorizedError("No User");
        }

        const user = { id: id };

        const accessToken = sign(user);
        // const accessToken = sign(req.user);
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
            throw new UnauthorizedError("No User");
        }

        const user = { id: id };

        const accessToken = sign(user);
        // const accessToken = sign(req.user);
        const refreshToken = refresh();
        (await RedisSingleton.getClient()).SET(String(id), refreshToken, { EX: REFRESH_TOKEN_EXPIRES });

        // res.cookie("x-auth-cookie", accessToken, {httpOnly: true, sameSite: "none"});
        // res.cookie("x-auth-cookie-refresh", refreshToken, {httpOnly: true, sameSite: "none"});
        res.cookie("x-auth-cookie", accessToken, {httpOnly: true, sameSite: "none", secure: true});
        res.cookie("x-auth-cookie-refresh", refreshToken, {httpOnly: true, sameSite: "none", secure: true});

        res.redirect("https://chore-comment.rf-server-static.pages.dev/login/success");
        // res.redirect("http://localhost:3000/login/success");
    };
}

const authRouter = Router();

authRouter.get("/refresh", controllerHandler(refreshJwt));

authRouter.get("/kakao", controllerHandler(loginKakao), setCookieAndRedirect());

authRouter.get("/kakao-t", passport.authenticate("kakao"));
authRouter.get("/kakao-t/callback", passport.authenticate("kakao", {
    failureRedirect: ""
    }),
    setCookieAndRedirectWeb()
);

authRouter.get(
    "/logout",
    controllerHandler(async (req: Request, res: Response) => {
        const KAKAO_ACCESS_TOKEN = req.user?.accessToken || req.flash(KakaoStrategyError)[0];
        // console.log("KAKAO_ACCESS_TOKEN :", KAKAO_ACCESS_TOKEN);
        if (KAKAO_ACCESS_TOKEN) {
            await axios({
                method: "POST",
                url: "https://kapi.kakao.com/v1/user/unlink",
                headers: {
                    Authorization: `Bearer ${KAKAO_ACCESS_TOKEN}`
                }
            });
        }

        const id = req.id || req.user?.id;
        if(id) {
            (await RedisSingleton.getClient()).DEL(String(id));
        }
        req.logOut((error) => {
            if (error) {
                throw new BadReqError(error);
            }
        });

        res.cookie('x-auth-cookie', '', { expires: new Date(0) });
        res.cookie('x-auth-cookie-refresh', '', { expires: new Date(0) });

        res.status(204).send("ok");
        // res.redirect(conf().CLIENT_DOMAIN);
    })
);

export { authRouter };
