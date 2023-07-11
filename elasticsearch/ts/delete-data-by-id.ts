import { Client } from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    const indexName = "search_log";
    const rv = await client.indices.exists({ index: indexName });

    if (!rv.body) {
        console.log("No Index");
        return;
    }

    const id = "9";
    const rv2 = await client.delete({
        index: indexName,
        id
    });

    console.log("rv2 :", rv2);

    process.exit(1);
};

if (require.main === module) {
    main();
}
