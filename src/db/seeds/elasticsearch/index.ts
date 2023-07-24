import { Client } from "@elastic/elasticsearch";
import { createClothesIndex, createPostIndex, createSearchLogIndex } from "./scripts/create-index";
import { createIdWithTimestampPipeline, createTimestampPipeline } from "./scripts/create-piptline";
// import { client } from "../../../db/elasticsearch";
export const seedElasticsearch = async (client: Client) => {
    await createTimestampPipeline(client);
    await createIdWithTimestampPipeline(client);

    await createPostIndex(client);
    await createClothesIndex(client);
    await createSearchLogIndex(client);
};

if (require.main === module) {
    console.log("start seed!");
    const client = new Client({
        // node: conf().ELK_DB,
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });
    seedElasticsearch(client).then(() => {
        console.log("es seed 완료!");
    });
}
