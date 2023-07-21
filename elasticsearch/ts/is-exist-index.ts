import { Client } from "@elastic/elasticsearch";
import { POSTS_INDEX } from "../../src/domains/search/constants";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    // const indexName = "read_me";
    const indexName = POSTS_INDEX;
    
    const isIndexExist = await client.indices.exists({ index: indexName });
    if(isIndexExist.body){
        console.log(`Index already exist : ${indexName}`);
        return;
    }

    // console.log("indexNames :", indexNames);
    // console.log("plugins :", plugins.body);
};

main();
