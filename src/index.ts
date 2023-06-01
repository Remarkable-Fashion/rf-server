import { startApp } from "./app";
import { conf, isProd } from "./config";
import { mongo } from "./db/mongodb";

const main = async () => {
    await mongo.connect();

    const app = startApp();

    app.listen(conf().PORT, () => {
        console.log(`rc Server has opened! : ${ isProd ? "prod" : "dev"}`);
    });
};

if (require.main === module) {
    main();
}
