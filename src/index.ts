import { startApp } from "./app";
import { conf } from "./config";

if (require.main === module) {
    const app = startApp();

    app.listen(conf().PORT, () => {
        console.log("rf Server has opened!");
    });
}
