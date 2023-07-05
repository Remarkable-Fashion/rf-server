import { Client } from "@elastic/elasticsearch";
import { conf } from "../config";

export const client = new Client({
    node: conf().ELK_DB,
    // node: "http://dev-elasticsearch:9200",
    // node: "http://localhost:9200",
    maxRetries: 5,
    requestTimeout: 60000,
    sniffOnStart: true
});

if (require.main === module) {
    console.log("test");
    const client = new Client({
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });
    client.ping();

    client.search(
        {
            index: "search_log",
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
