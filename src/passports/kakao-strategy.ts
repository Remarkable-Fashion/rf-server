/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { Role, SocialType } from "@prisma/client";
import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { conf } from "../config";
import prisma from "../db/prisma";
import { createUser } from "../domains/users/service/create-user";
import { getUserByEmail } from "../domains/users/service/get-user-by-email";
import { getUserBySocialTestService } from "../domains/users/service/get-user-by-social-test";
import { BadReqError } from "../lib/http-error";
import { getUserBySocialService } from "../domains/users/service/get-user-by-social";
import { KAKAO_CONNECT_STRATEGY, KAKAO_LOGIN_STRATEGY } from "@/constants";
import { createSocialService } from "@domains/users/service/create-social";
// import { createSocialService } from "../domains/users/service/create-social";

export const KakaoStrategyError = "KakaoStrategyError";
export default () => {
    // 로그인
    passport.use(
        KAKAO_LOGIN_STRATEGY,
        new KakaoStrategy(
            {
                ...conf().KAKAO_LOGIN_CONFIG,
                passReqToCallback: true
            },
            async (req, accessToken, _refreshToken, profile, cb) => {
                console.log("### 카카오 로그인");
                const { has_email, email, name: _name } = profile._json.kakao_account;

                if (!has_email || !email) {
                    return cb(null, false, { message: accessToken, type: KakaoStrategyError });
                }

                const socialId = profile._json.id.toString();

                if (!socialId) {
                    return cb(null, false, { message: accessToken, type: KakaoStrategyError });
                }

                const isLogin = req.user;

                console.log("isLogin :", isLogin);
                console.log("req.id :", req.id);

                if (isLogin) {
                    return cb(new BadReqError("이미 카카오 로그인 되어있습니다."));
                }

                // 이메일로 찾으면 안됨.
                // const user = await getUserByEmail({ email, type: SocialType.Kakao, socialId }, prisma);
                const social = await getUserBySocialTestService({ type: SocialType.Kakao, socialId }, prisma);

                if (!social?.user) {
                    const createdUser = await createUser(
                        { user: { email }, meta: { role: Role.User }, social: { type: SocialType.Kakao, socialId } },
                        prisma
                    );
                    const data = {
                        id: createdUser.id,
                        email: createdUser.email,
                        name: createdUser.name,
                        role: createdUser.meta!.role,
                        type: SocialType.Kakao,
                        profile: createdUser.profile!,
                        token: {
                            kakao: accessToken
                        }
                    };

                    return cb(null, data);
                }
                const user = social.user;

                const data = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.meta!.role,
                    type: SocialType.Kakao,
                    profile: user.profile!,
                    token: {
                        kakao: accessToken
                    }
                };
                return cb(null, data);
            }
        )
    );
    // 연동
    passport.use(
        KAKAO_CONNECT_STRATEGY,
        new KakaoStrategy(
            {
                ...conf().KAKAO_CONNECT_CONFIG,
                passReqToCallback: true
            },
            async (req, accessToken, _refreshToken, profile, cb) => {
                console.log("### 카카오 연동");
                const { has_email, email, name: _name } = profile._json.kakao_account;

                if (!has_email || !email) {
                    return cb(null, false, { message: accessToken, type: KakaoStrategyError });
                    // return cb(new BadReqError("Not Found Email"));
                }

                const socialId = profile._json.id.toString();

                if (!socialId) {
                    return cb(null, false, { message: accessToken, type: KakaoStrategyError });
                }

                // const isLogin = req.user;

                // console.log("isLogin :", isLogin);
                // console.log("req.id :", req.id);

                if (!req.user) {
                    return cb(new BadReqError("로그인이 안되어 있습니다."));
                }

                if (req.user.type === "Kakao") {
                    return cb(new BadReqError("카카오 로그인 상태에서 카카오 연동 할수 없습니다."));
                }

                const social = await getUserBySocialService({ type: SocialType.Kakao, socialId }, prisma);
                if (social) {
                    // 이미 연동됨.

                    if (req.user.id !== social.userId) {
                        return cb(new BadReqError("이미 회원가입한 카카오 아이디는 연동 할수 없습니다."));
                    }
                    // const data = {};
                    return cb(new BadReqError("이미 카카오 연동되어 있습니다."));
                }

                const newSocial = await createSocialService({ userId: req.user.id, socialId, type: SocialType.Google }, prisma);
                const data = {
                    social: newSocial,
                    type: SocialType.Kakao,
                    socialId: socialId,
                    token: {
                        kakao: accessToken
                    }
                };

                return cb(null, data as any);
            }
        )
    );
};
