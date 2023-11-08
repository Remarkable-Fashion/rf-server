// import { Users } from "@prisma/client";
import passport from "passport";
import { UserWithRole } from "../@types/express";
import { NotFoundError } from "../lib/http-error";
import kakao from "./kakao-strategy";
import google from "./google-strategy";

export default () => {
    passport.serializeUser((user: UserWithRole, done) => {
        return done(null, user);
    });
    passport.deserializeUser(async (user: UserWithRole, done) => {
        if (!user) {
            return done(new NotFoundError("No User"));
        }
        return done(null, user);
    });

    kakao();
    google();
};
