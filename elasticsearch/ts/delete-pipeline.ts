import { Client } from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    await client.ingest.deletePipeline({ id: "id-timestamp" });
    await client.ingest.deletePipeline({ id: "ida-timestamp" });
    await client.ingest.deletePipeline({ id: "id-timestamp-auto" });

    // console.log("rv :", rv.body);
};

main();
