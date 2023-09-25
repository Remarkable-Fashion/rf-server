import { Client } from "@opensearch-project/opensearch";
import { conf } from "../config";

// console.log("conf().ELK_DB :", conf().ELK_DB);
export const client = new Client({
    node: conf().ELK_DB
});

export type EsClient = Client;

client
    .ping()
    .then(() => console.log("ES Connected"))
    .catch(() => console.log("ES Connect Failed !!"));

if (require.main === module) {
    console.log("test");
    // eslint-disable-next-line no-shadow
    // const client = new Client({
    //     node: "http://localhost:9200",
    //     maxRetries: 5,
    //     requestTimeout: 60000,
    //     sniffOnStart: true
    // });

    client.search(
        {
            index: "posts",
            body: {
                size: 1,
                sort: [
                    {
                        timestamp: {
                            order: "desc"
                        }
                    }
                ]
            }
        },
        (err, result) => {
            if (err) {
                console.log("err :", err);
                return;
            }

            console.log("result :", result.body.hits);
            console.log("result :", result.body.hits.hits);
        }
    );
}
