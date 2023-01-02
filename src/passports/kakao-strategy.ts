/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { conf } from "../config";
import prisma from "../db/prisma";
import { createUser } from "../domains/users/service/create-user";
import { getUserByEmail } from "../domains/users/service/get-user-by-email";
import { BadReqError } from "../lib/http-error";

export default () => {
    passport.use(
        new KakaoStrategy({ ...conf().KAKAO_CONFIG }, async (accessToken, _refreshToken, profile, cb) => {
            const { has_email, email, name: _name } = profile._json.kakao_account;
            if (!has_email || !email) {
                return cb(new BadReqError("Not Found Email"));
            }

            const user = await getUserByEmail({ email }, prisma);

            if (!user) {
                const createdUser = await createUser({ email }, prisma);
                const data = { id: createdUser.id, email: createdUser.email, name: createdUser.name, role: createdUser.meta!.role };

                return cb(null, { ...data, accessToken });
            }
            const data = { id: user.id, email: user.email, name: user.name, role: user.meta!.role };
            return cb(null, { ...data, accessToken });
        })
    );
};
