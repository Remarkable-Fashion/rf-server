import path from "path";

export const isProd = process.env.NODE_ENV === "production";
export const conf = () => {
    const PORT = process.env.PORT || 3000;

    const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 14; // 30일

    const SESSION_OPTION = {
        secret: process.env.SESSION_SECRET || "sesecret",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: COOKIE_MAX_AGE,
            secure: false,
            httpOnly: true
        }
    };

    const LOG_DIR = isProd ? "logs" : "dev-logs";

    // /app/images
    const IMAGES_DIR_PATH = path.join(process.cwd(), isProd ? "images" : "dev-images");
    const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 600 * 1000; // 600kb
    const MAX_FILES = Number(process.env.MAX_FILES) || 10;

    const CORS_CONFIG = {
        origin: "*"
    };

    const JWT_SECRET = process.env.JWT_SECRET || "wjwjs";
    const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

    const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN || "http://localhost:3000";
    const SERVER_DOMAIN = process.env.SERVER_DOMAIN || "http://localhost:3000";

    const KAKAO_CONFIG = {
        clientID: process.env.KAKAO_CLIENT_ID || "",
        clientSecret: "",
        callbackURL: process.env.KAKAO_CALLBACK_URL || "http://localhost:3000/kakao/callback"
    };

    const RATELIMIT_WINDOW = Number(process.env.RATELIMIT_WINDOW) || 15 * 60 * 1000; // 15분
    const RATELIMIT_MAX = Number(process.env.RATELIMIT_MAX) || 100;

    const MONGO_URI = process.env.MONGO_URI || "";
    const MONGO_DB = process.env.MONGO_DB || "nana";

    const API_RATE_LIMIT_WHITE_LIST = ["127.0.0.1"];

    const ELK_DB = process.env.ELK_DB || "localhost:9200";

    const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID || "";
    const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "";
    const S3_BUCKET_URL = process.env.S3_BUCKET_URL || "";

    return {
        PORT,
        SESSION_OPTION,
        CORS_CONFIG,
        JWT_SECRET,
        REDIS_URL,
        CLIENT_DOMAIN,
        SERVER_DOMAIN,
        KAKAO_CONFIG,
        RATELIMIT_WINDOW,
        RATELIMIT_MAX,
        IMAGES_DIR_PATH,
        MAX_FILE_SIZE,
        MAX_FILES,
        MONGO_URI,
        MONGO_DB,
        API_RATE_LIMIT_WHITE_LIST,
        LOG_DIR,
        ELK_DB,
        ACCESS_KEY_ID,
        SECRET_ACCESS_KEY,
        S3_BUCKET_URL
    };
};
