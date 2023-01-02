import { Router, type Request, type Response } from "express";
import passport from "passport";
import axios from "axios";
import { conf } from "../config";
import { getRedis } from "../db/redis";
import { refreshJwt } from "../domains/auth/controller/refresh-jwt";
import { controllerHandler } from "../lib/controller-handler";
import { refresh, sign } from "../lib/jwt";
import { BadReqError, UnauthorizedError } from "../lib/http-error";
import { authRole } from "../middleware/auth";

const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 14; // 2주
function setCookieAndRedirect() {
    return (req: Request, res: Response) => {
        if (!req.user) {
            throw new UnauthorizedError("No User");
        }

        const accessToken = sign(req.user);
        const refreshToken = refresh();
        getRedis().SET(String(req.user.id), refreshToken, { EX: REFRESH_TOKEN_EXPIRES });

        res.setHeader("x-auth-cookie", accessToken);
        res.setHeader("x-auth-cookie-refresh", refreshToken);
        // res.cookie("x-auth-cookie", accessToken);
        // res.cookie("x-auth-cookie-refresh", refreshToken);

        res.redirect(conf().CLIENT_DOMAIN);
    };
}

const authRouter = Router();

authRouter.get("/test", (req, res) => {
    res.json({ msg: "auth test" });
});

authRouter.get("/test-role-1", authRole("User"), (req, res) => {
    res.json({ msg: "auth test" });
});

authRouter.get(
    "/test-role-2",
    (req, res, next) => {
        req.user = {
            id: 1,
            email: "asdf",
            name: "adsf",
            role: "User"
        };
        next();
    },
    authRole("User"),
    (req, res) => {
        res.json({ msg: `My Role Is ${req.user?.role}` });
    }
);

authRouter.get(
    "/sign-test",
    (req, res) => {
        req.user = { id: 1, name: "test", email: "test@gmail.com", role: "Admin" };

        const accessToken = sign(req.user);
        const refreshToken = refresh();
        getRedis().SET(String(req.user.id), refreshToken, { EX: REFRESH_TOKEN_EXPIRES });

        res.setHeader("x-auth-cookie", accessToken);
        res.setHeader("x-auth-cookie-refresh", refreshToken);

        res.status(204).send("ok");
        // next();
    }
    // setCookieAndRedirect()
);

authRouter.get("/refresh", controllerHandler(refreshJwt));

authRouter.get(
    "/kakao",
    passport.authenticate("kakao")
    // passport.authenticate("kakao", {
    //   scope: []
    // })
);

authRouter.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: `${conf().CLIENT_DOMAIN}/login`
    }),
    setCookieAndRedirect()
    // (_, res) => {
    //   res.redirect(`${CLIENT_DOMAIN}/test`);
    // }
);

authRouter.get(
    "/logout",
    controllerHandler(async (req: Request, res: Response) => {
        const KAKAO_ACCESS_TOKEN = req.user?.accessToken;
        if (KAKAO_ACCESS_TOKEN) {
            await axios({
                method: "POST",
                url: "https://kapi.kakao.com/v1/user/unlink",
                headers: {
                    Authorization: `Bearer ${KAKAO_ACCESS_TOKEN}`
                }
            });
        }
        req.logOut((error) => {
            if (error) {
                throw new BadReqError(error);
            }
        });
        res.redirect(conf().CLIENT_DOMAIN);
        // await req.session.destroy((err) => {
        //   if (err) {
        //     throw new Error("session is not destroy");
        //   }
        //   req.logOut((error) => {
        //     if (error) {
        //       throw new Error(error);
        //     }
        //   });
        //   res.redirect(CLIENT_DOMAIN);
        // });
    })
);

export { authRouter };
