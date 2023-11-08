import "module-alias/register";
import { RedisSingleton } from "./db/redis";
import { startApp } from "./app";
import { conf, isProd } from "./config";

const main = async () => {
    await RedisSingleton.getClient();
    // await redisClient.connect();
    // redisClient.ping()
    console.log("redis 연결?");
    // await client.ping();

    // @TODO 클래스로 수정.
    // const redis = await RedisSingleton.getInstance();
    // await redis.connect();

    const app = await startApp();

    app.listen(conf().PORT, () => {
        console.log(`rc Server has opened! :${conf().PORT} ${isProd ? "prod" : "dev"}`);
    });
};

if (require.main === module) {
    main();
}
