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

    const CORS_CONFIG = {
        origin: "*"
    };

    const JWT_SECRET = process.env.JWT_SECRET || "wjwjs";
    const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

    const CLIENT_DOMAIN = "http://localhost:3000";

    const KAKAO_CONFIG = {
        clientID: process.env.KAKAO_CLIENT_ID || "",
        clientSecret: "",
        callbackURL: process.env.KAKAO_CALLBACK_URL || "http://localhost:3000/kakao/callback"
    };

    return {
        PORT,
        SESSION_OPTION,
        CORS_CONFIG,
        JWT_SECRET,
        REDIS_URL,
        CLIENT_DOMAIN,
        KAKAO_CONFIG
    };
};
