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

    const postsSettings = await client.indices.getSettings({index: indexName});
    const stringSettings = JSON.stringify(postsSettings.body[indexName].settings, null, 2);
    console.log(stringSettings);

    const postsMappings = await client.indices.getMapping({index: indexName});

    const stringMappings = JSON.stringify(postsMappings.body[indexName], null, 2);
    console.log(stringMappings);
};

main();
