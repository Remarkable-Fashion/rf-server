import * as redis from "redis";
import { conf } from "../config";
import { BadReqError } from "../lib/http-error";

const client = redis.createClient({ url: conf().REDIS_URL });
client.on("error", (err) => console.log("Redis Client Error", err));
(async () => {
    await client.connect();
})();

// export const connectRedis = async () => {
//   client = redis.createClient({ url: REDIS_URL });
//   client.on("error", (err) => console.log("Redis Client Error", err));
//   await client.connect();
// };

export const getRedis = () => {
    if (!client) {
        throw new BadReqError("No Connection Redis");
    }
    return client;
};
