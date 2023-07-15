import { Client } from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    const indexName = "test-nori";
    const rv = await client.indices.exists({ index: indexName });

    if (!rv.body) {
        console.log("No Index");
        return;
    }

    await client.indices.delete({ index: indexName });

    process.exit(1);
};

if (require.main === module) {
    main();
}
