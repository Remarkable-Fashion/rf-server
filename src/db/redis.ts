import * as Iredis from "redis";
import { conf } from "../config";
import { BadReqError } from "../lib/http-error";

const client = Iredis.createClient({ url: conf().REDIS_URL });
client.on("error", (err) => console.log("Redis Client Error", err));
(async () => {
    await client.connect();
})();

const getRedis = () => {
    if (!client) {
        throw new BadReqError("No Connection Redis");
    }
    return client;
};

export type RedisType = typeof client;

export const redis = getRedis();
