import rateLimit from 'express-rate-limit'
import RedisStore from "rate-limit-redis";
import { conf } from '../config';
import { getRedis } from '../db/redis';

export const apiLimiter = rateLimit({
        windowMs: conf().RATELIMIT_WINDOW,
        max: conf().RATELIMIT_MAX, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        store: new RedisStore({
            sendCommand: (...args: string[]) => getRedis().sendCommand(args)
        }),
        message: async () => {
            return "You can only make 100 request per 15 miniutes"
        }
    })