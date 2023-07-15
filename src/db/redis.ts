import * as redis from "redis";
import { conf } from "../config";
import { BadReqError } from "../lib/http-error";

export type RedisClient = typeof redisClient;

const redisClient = redis.createClient({ url: conf().REDIS_URL });
redisClient.on("error", (err) => console.log("Redis Client Error", err));
(async () => {
    await redisClient.connect();
})();

export class RedisSingleton {
    private static instance: RedisSingleton;

    private readonly _client;

    private constructor(url?: string) {
        this._client = redis.createClient({ url: url || conf().REDIS_URL });

        this._client.on("error", (err) => console.log("Redis Client Error", err));
    }

    // public static async getClient(){
    //     const instance = await RedisSingleton.getInstance()

    //     return instance._client;
    // }

    get client() {
        return this._client;
    }

    public static getInstance(url?: string) {
        if (!RedisSingleton.instance) {
            RedisSingleton.instance = new RedisSingleton(url);
        }

        // return RedisSingleton.instance.client;
        return RedisSingleton.instance;
    }

    async connect() {
        await this._client.connect();
    }

    async disConnect() {
        await this._client.quit();
    }
}

export const getRedis = () => {
    if (!redisClient) {
        throw new BadReqError("No Connection Redis");
    }
    return redisClient;
};

export {redisClient};
