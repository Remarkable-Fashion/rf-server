import express from "express";
import cors from "cors";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import RedisStore from "connect-redis";
import passportConfig from "./passports";
import { dbErrorMiddleware, errorMiddleware } from "./middleware/error";
import { requestLoggerMiddleware } from "./middleware/log";
import { router } from "./routes";
import { conf, isProd } from "./config";
import { apiLimiterFunc } from "./middleware/api-rate-limit";
import { getRedis } from "./db/redis";

export const startApp = () => {
    const app = express();

    app.use(cors(conf().CORS_CONFIG));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    passportConfig();
    app.use(
        session({
            ...conf().SESSION_OPTION,
            ...(isProd
                ? {
                      store: new RedisStore({
                          client: getRedis()
                      })
                  }
                : {})
        })
    );
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    app.set("trust proxy", 1);

    app.use(
        "/",
        apiLimiterFunc({
            skip: [...conf().API_RATE_LIMIT_WHITE_LIST]
        })
    );

    app.use(requestLoggerMiddleware);

    app.get("/ping", (req, res) => {
        res.send("pong");
    });

    app.use("/", express.static(conf().IMAGES_DIR_PATH));

    const API_PREFIX = "/api/v1";
    app.use(API_PREFIX, router);

    app.use("*", (req, res) => {
        res.status(404).json({ msg: "Not Found Page" });
    });

    app.use(dbErrorMiddleware);
    app.use(errorMiddleware);

    return app;
};
