/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { Role, SocialType } from "@prisma/client";
import passport from "passport";
// import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy } from "passport-google-oauth20";
import { conf } from "../config";
import prisma from "../db/prisma";
import { createUser } from "../domains/users/service/create-user";
import { getUserByEmail } from "../domains/users/service/get-user-by-email";
import { getUserBySocialService } from "../domains/users/service/get-user-by-social";
import { BadReqError } from "../lib/http-error";
import { getUserBySocialTestService } from "@domains/users/service/get-user-by-social-test";
import { GOOGLE_CONNECT_STRATEGY, GOOGLE_LOGIN_STRATEGY } from "@/constants";
import { createSocialService } from "@domains/users/service/create-social";

export const GoogleStrategyError = "GoogleStrategyError";
export default () => {
    // 로그인

    passport.use(
        GOOGLE_LOGIN_STRATEGY,
        new Strategy(
            {
                ...conf().GOOGLE_LOGIN_CONFIG,
                passReqToCallback: true
            },
            async (req, accessToken, _refreshToken, profile, cb) => {
                console.log("##### 구글 로그인");
                console.log("profile :", profile);
                const email = profile._json.email;

                if (!email) {
                    // return cb(null, false, { message: accessToken, type: GoogleStrategyError });
                    return cb(new BadReqError("Not Found Email"));
                }

                const socialId = profile.id;

                if (!socialId) {
                    // return cb(null, null, { message: accessToken, type: GoogleStrategyError });
                    return cb(new BadReqError("Not Found socialId"));
                }

                const isLogin = req.user;

                console.log("isLogin :", isLogin);

                if (isLogin) {
                    return cb(new BadReqError("이미 구글 로그인 되어있습니다."));
                }

                // if(!isLogin){
                // const user = await getUserByEmail({ email, type: SocialType.Google, socialId }, prisma);
                const social = await getUserBySocialTestService({ type: SocialType.Google, socialId }, prisma);

                console.log("social :", social);

                if (!social?.user) {
                    const createdUser = await createUser(
                        { user: { email }, meta: { role: Role.User }, social: { type: SocialType.Google, socialId } },
                        prisma
                    );
                    const data = {
                        id: createdUser.id,
                        email: createdUser.email,
                        name: createdUser.name,
                        role: createdUser.meta!.role,
                        type: SocialType.Google,
                        profile: createdUser.profile!,
                        token: {
                            google: accessToken
                        }
                    };

                    return cb(null, data as any);
                }

                const user = social.user;

                const data = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.meta!.role,
                    type: SocialType.Google,
                    // type: user.socials[0].type,
                    profile: user.profile!,
                    token: {
                        google: accessToken
                    }
                };
                return cb(null, data as any);
            }
        )
    );
    // 연동
    passport.use(
        GOOGLE_CONNECT_STRATEGY,
        new Strategy({ ...conf().GOOGLE_CONNECT_CONFIG, passReqToCallback: true }, async (req, accessToken, _refreshToken, profile, cb) => {
            console.log("##### 구글 연동");
            const email = profile._json.email;

            if (!email) {
                // return cb(null, false, { message: accessToken, type: GoogleStrategyError });
                return cb(new BadReqError("Not Found Email"));
            }

            const socialId = profile.id;

            if (!socialId) {
                // return cb(null, false, { message: accessToken, type: GoogleStrategyError });
                return cb(new BadReqError("Not Found socialId"));
            }

            // const isLogin = req.user;

            // console.log("isLogin :", isLogin);

            if (!req.user) {
                return cb(new BadReqError("로그인이 안되어 있습니다."));
            }

            if (req.user.type === "Google") {
                return cb(new BadReqError("구글 로그인 상태에서 구글 연동 할수 없습니다."));
            }

            const social = await getUserBySocialService({ type: SocialType.Google, socialId }, prisma);
            if (social) {
                // 이미 연동됨.

                if (req.user.id !== social.userId) {
                    return cb(new BadReqError("이미 회원가입한 구글 아이디는 연동 할수 없습니다."));
                }
                // const data = {};
                return cb(new BadReqError("이미 구글 연동되어 있습니다."));
            }
            const newSocial = await createSocialService({ userId: req.user.id, socialId, type: SocialType.Google }, prisma);
            const data = {
                social: newSocial,
                type: SocialType.Google,
                socialId: socialId,
                token: {
                    google: accessToken
                }
            };

            return cb(null, data as any);
        })
    );
};
