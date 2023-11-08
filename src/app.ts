import { conf, isProd } from "./config";
import { RedisSingleton } from "./db/redis";
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import passport from "passport";
import RedisStore from "connect-redis";
import helmet from "helmet";
import passportConfig from "./passports";
import { dbErrorMiddleware, errorMiddleware } from "./middleware/error";
import { requestLoggerMiddleware } from "./middleware/log";
import { router } from "./routes";
import { apiLimiterFunc } from "./middleware/api-rate-limit";

export const startApp: () => Promise<express.Application> = async () => {
    const redisClient = await RedisSingleton.getClient();
    const app: express.Application = express();

    app.use(helmet());
    app.use(cors(conf().CORS_CONFIG));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    passportConfig();
    app.use(
        session({
            ...conf().SESSION_OPTION,
            ...(isProd
                ? {
                      store: new RedisStore({
                          client: redisClient
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
