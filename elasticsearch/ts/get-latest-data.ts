import { Client } from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    const index = "search_log";
    const rv = await client.search({
        index,
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
    });

    console.log(rv.body.hits.hits);
    console.log(rv.body.hits.hits[0]._id);

    process.exit(1);
};

if (require.main === module) {
    main();
}
