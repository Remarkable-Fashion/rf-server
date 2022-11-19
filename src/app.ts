import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import passportConfig from "./passports";
import { dbErrorMiddleware, errorMiddleware } from "./middleware/error";
import { requestLoggerMiddleware } from "./middleware/log";
import { router } from "./routes";
import { conf } from "./config";

export const startApp = () => {
    const app = express();

    app.use(cors(conf().CORS_CONFIG));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    passportConfig();
    app.use(session({ ...conf().SESSION_OPTION }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(requestLoggerMiddleware);

    app.get("/ping", (req, res) => {
        res.send("pong");
    });

    app.use("/api/v1", router);

    app.use("*", (req, res) => {
        res.status(404).json({ msg: "404" });
    });

    app.use(dbErrorMiddleware);
    app.use(errorMiddleware);

    return app;
};
