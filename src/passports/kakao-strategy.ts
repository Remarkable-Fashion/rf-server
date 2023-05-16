/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { Role, SocialType } from "@prisma/client";
import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { conf } from "../config";
import prisma from "../db/prisma";
import { createUser } from "../domains/users/service/create-user";
import { getUserByEmail } from "../domains/users/service/get-user-by-email";
import { BadReqError } from "../lib/http-error";

export const KakaoStrategyError = "KakaoStrategyError";
export default () => {
    passport.use(
        new KakaoStrategy({ ...conf().KAKAO_CONFIG }, async (accessToken, _refreshToken, profile, cb) => {
            const { has_email, email, name: _name } = profile._json.kakao_account;

            if (!has_email || !email) {
                return cb(null, false, { message: accessToken, type: KakaoStrategyError });
                // return cb(new BadReqError("Not Found Email"));
            }

            const socialId = profile._json.id.toString();

            if (!socialId) {
                return cb(null, false, { message: accessToken, type: KakaoStrategyError });
                // return cb(new BadReqError("Not Found socialId"))
            }

            const user = await getUserByEmail({ email, type: SocialType.Kakao, socialId }, prisma);

            if (!user) {
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
                    profile: createdUser.profile!
                };

                return cb(null, { ...data, accessToken });
            }

            const data = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.meta!.role,
                type: user.socials[0].type,
                profile: user.profile!
            };
            return cb(null, { ...data, accessToken });
        })
    );
};
