import { startApp } from "./app";
import { conf, isProd } from "./config";

const main = async () => {
    // await mongo.connect();
    // await client.ping();

    // @TODO 클래스로 수정.
    // const redis = await RedisSingleton.getInstance();
    // await redis.connect();

    const app = startApp();

    app.listen(conf().PORT, () => {
        console.log(`rc Server has opened! : ${isProd ? "prod" : "dev"}`);
    });
};

if (require.main === module) {
    main();
}
