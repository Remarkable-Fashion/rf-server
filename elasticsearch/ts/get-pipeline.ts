import { Client } from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    const rv = await client.ingest.getPipeline();
    // console.log("rv :", rv);
    console.log("rv :", rv.body);
};

main();
