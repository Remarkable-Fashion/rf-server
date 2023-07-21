import { Client } from "@elastic/elasticsearch";
import { createClothesIndex, createPostIndex, createSearchLogIndex } from "./scripts/create-index";
import { createIdWithTimestampPipeline, createTimestampPipeline } from "./scripts/create-piptline";
export const seedElasticsearch = async (client: Client) => {

    // await createTimestampPipeline(client);
    // await createIdWithTimestampPipeline(client);
    
    await createPostIndex(client);
    await createClothesIndex(client);
    await createSearchLogIndex(client);
}