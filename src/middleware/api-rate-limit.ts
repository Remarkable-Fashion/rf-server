import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { conf } from "../config";
import { getRedis } from "../db/redis";

type limitOption = {
    /**
     * API 주기, default minute.
     */
    time?: number;

    max?: number;
};
export const apiLimiterFunc = ({ time, max: _max }: limitOption = {}) => {
    const windowMs = (time && time * 60 * 1000) || conf().RATELIMIT_WINDOW;
    const max = _max || conf().RATELIMIT_MAX;

    return rateLimit({
        windowMs, // 시간당
        max, // Limit each IP to 100 requests per `window` (here, per 15 minutes) // 회수
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        store: new RedisStore({
            sendCommand: (...args: string[]) => getRedis().sendCommand(args)
        }),
        message: async () => {
            return `You can only make ${max} request per ${windowMs} millisecond`;
        }
    });
};
