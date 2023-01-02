import path from "path";

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

    // /app/images
    const IMAGES_DIR_PATH = path.join(process.cwd(), "images");
    const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 600 * 1000; // 600kb
    const MAX_FILES = Number(process.env.MAX_FILES) || 10;

    const CORS_CONFIG = {
        origin: "*"
    };

    const JWT_SECRET = process.env.JWT_SECRET || "wjwjs";
    const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

    const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN || "http://localhost:3000";

    const KAKAO_CONFIG = {
        clientID: process.env.KAKAO_CLIENT_ID || "",
        clientSecret: "",
        callbackURL: process.env.KAKAO_CALLBACK_URL || "http://localhost:3000/kakao/callback"
    };

    const RATELIMIT_WINDOW = Number(process.env.RATELIMIT_WINDOW) || 15 * 60 * 1000; // 15분
    const RATELIMIT_MAX = Number(process.env.RATELIMIT_MAX) || 100;

    return {
        PORT,
        SESSION_OPTION,
        CORS_CONFIG,
        JWT_SECRET,
        REDIS_URL,
        CLIENT_DOMAIN,
        KAKAO_CONFIG,
        RATELIMIT_WINDOW,
        RATELIMIT_MAX,
        IMAGES_DIR_PATH,
        MAX_FILE_SIZE,
        MAX_FILES
    };
};
