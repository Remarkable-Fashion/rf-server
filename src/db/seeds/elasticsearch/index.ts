// import { Client } from "@opensearch-project/opensearch";
import { client as Ccleint, EsClient } from "../../elasticsearch";
import { createClothesIndex, createPostIndex, createSearchLogIndex } from "./scripts/create-index";
import { createIdWithTimestampPipeline, createTimestampPipeline } from "./scripts/create-piptline";
// import { conf } from "../../../config";

// console.log("conf().ELK_DB :", conf().ELK_DB);

export const seedElasticsearch = async (client: EsClient) => {
    await createTimestampPipeline(client);
    await createIdWithTimestampPipeline(client);

    await createPostIndex(client);
    await createClothesIndex(client);
    await createSearchLogIndex(client);
};

if (require.main === module) {
    console.log("start seed!");
    // const client = new Client({
    //     // node: conf().ELK_DB
    //     node: "url"
    //     // node: "http://dev-elasticsearch:9200",
    //     // node: "http://localhost:9200"
    //     // maxRetries: 5,
    //     // requestTimeout: 60000,
    //     // sniffOnStart: true
    // });
    Ccleint.ping().then(() => console.log("???"));
    seedElasticsearch(Ccleint).then(() => {
        console.log("es seed 완료!");
    });
}
