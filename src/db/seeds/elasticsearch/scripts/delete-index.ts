import { Client } from "@elastic/elasticsearch";
import { CLOTHES_INDEX, POSTS_INDEX, SEARCH_LOG_INDEX } from "../../../../domains/search/constants";

const deleteIndex = async (indexName: string, client: Client) => {
    const rv = await client.indices.exists({ index: indexName });

    if (!rv.body) {
        console.log(`No Index :${indexName}`);
        return;
    }
    await client.indices.delete({ index: indexName });
};

const main = async (client: Client) => {
    await deleteIndex(POSTS_INDEX, client);
    await deleteIndex(CLOTHES_INDEX, client);
    await deleteIndex(SEARCH_LOG_INDEX, client);
};

if (require.main === module) {
    import("../../../elasticsearch").then(({ client }) => {
        main(client).then(() => console.log("Success Delete Index"));
    });

    // deleteIndex(CLOTHES_INDEX, cclient).then(() => {
    //     console.log("Success Delete Index");
    // });
}
