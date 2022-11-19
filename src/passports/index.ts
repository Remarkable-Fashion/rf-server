import { Users } from "@prisma/client";
import passport from "passport";
import { NotFoundError } from "../lib/http-error";
import kakao from "./kakao-strategy";

export default () => {
    passport.serializeUser((user: Users, done) => {
        return done(null, user);
    });
    passport.deserializeUser(async (user: Users, done) => {
        if (!user) {
            return done(new NotFoundError("No User"));
        }
        return done(null, user);
    });

    kakao();
};
