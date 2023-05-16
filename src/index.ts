import { startApp } from "./app";
import { conf } from "./config";
import { mongo } from "./db/mongodb";

const main = async () => {
    await mongo.connect();

    const app = startApp();

    app.listen(conf().PORT, () => {
        console.log("rf Server has opened!");
    });
};

if (require.main === module) {
    main();
}
