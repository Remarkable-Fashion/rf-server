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

export class RedisSingleton {

    private static instance: RedisSingleton

    private readonly _client
    private constructor(url?: string){
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
    public static async getInstance(url?: string){
        if(!RedisSingleton.instance){
            RedisSingleton.instance = new RedisSingleton(url);
        }

        // return RedisSingleton.instance.client;
        return RedisSingleton.instance;
    }

    async connect(){
        await this._client.connect();
    }
}


export const getRedis = () => {
    if (!client) {
        throw new BadReqError("No Connection Redis");
    }
    return client;
};
