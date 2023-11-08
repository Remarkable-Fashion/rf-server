import * as redis from "redis";
import { conf } from "../config";
// import { BadReqError } from "../lib/http-error";

// console.log("redis REDIS_URL:", conf().REDIS_URL);
// const redisClient = redis.createClient({ url: conf().REDIS_URL });

// export type RedisClient = typeof redisClient;

// redisClient.once("connect", () => console.log("Redis Connected"));
// redisClient.on("error", (err) => console.log("Redis Client Error", err));

class RedisSingleton {
    private static instance: redis.RedisClientType;
  
    private constructor() {}
  
    public static async getClient(): Promise<redis.RedisClientType> {
      if (!RedisSingleton.instance) {
        RedisSingleton.instance = redis.createClient({
          url: conf().REDIS_URL,
        });
        
        RedisSingleton.instance.once("connect", () => console.log("Redis Connected"));
        RedisSingleton.instance.on('error', (err) =>
          console.error('Redis Client Error', err)
        );
  
        await RedisSingleton.instance.connect();
      }
  
      return RedisSingleton.instance;
    }
  }

export { RedisSingleton };
// export { redisClient, RedisSingleton };
