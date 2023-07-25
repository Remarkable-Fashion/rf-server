import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { conf, isProd } from "../config";
import { redisClient } from "../db/redis";

type limitOption = {
    /**
     * API 주기, default minute.
     */
    time?: number;

    max?: number;

    /**
     * 카운트 되지않을 ip 화이트리스트.
     */
    skip?: string[];

    /**
     * 글로벌 rate 카운트와 분리하고 싶은 경우.
     */
    postFix?: string;
};

export const apiLimiterFunc = ({ time, max: _max, skip, postFix }: limitOption = {}) => {
    const windowMs = (time && time * 60 * 1000) || conf().RATELIMIT_WINDOW;
    const max = _max || conf().RATELIMIT_MAX;

    if (!isProd) {
        return (req: Request, res: Response, next: NextFunction) => {
            next();
        };
    }

    return rateLimit({
        windowMs, // 시간당
        max, // Limit each IP to 100 requests per `window` (here, per 15 minutes) // 회수
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        ...(skip && skip.length > 0 ? { skip: (req) => skip.includes(req.ip) } : {}),
        ...(postFix ? { keyGenerator: (req, _) => `${req.ip}:${postFix || req.path}` } : {}),
        store: new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args)
        }),
        message: async () => {
            return `You can only make ${max} request per ${windowMs} millisecond`;
        }
    });
};
