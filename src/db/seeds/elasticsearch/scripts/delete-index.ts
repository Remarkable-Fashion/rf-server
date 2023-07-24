import { Client } from "@elastic/elasticsearch";
import { client as cclient } from "../../../elasticsearch";
import { CLOTHES_INDEX, POSTS_INDEX, SEARCH_LOG_INDEX } from "../../../../domains/search/constants";

const deleteIndex = async (indexName: string, client: Client) => {
    const rv = await client.indices.exists({ index: indexName });

    if (!rv.body) {
        console.log(`No Index :${indexName}`);
        return;
    }
    await client.indices.delete({ index: indexName });
};

const main = async () => {
    await deleteIndex(POSTS_INDEX, cclient);
    await deleteIndex(CLOTHES_INDEX, cclient);
    await deleteIndex(SEARCH_LOG_INDEX, cclient);
};

if (require.main === module) {
    main();
}
