import { Client } from "@opensearch-project/opensearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "https://search-dev-rc-es1-y46sorvm5cmd3a7dnbl7uhpypq.ap-northeast-2.es.amazonaws.com"
    });

    const rv = await client.cat.indices({ format: "json" });

    console.log("rv :", rv);
    const indexNames = rv.body.map((a: any) => {
        return a.index;
    });

    console.log("indexNames :", indexNames);
    // console.log("plugins :", plugins.body);
};

main();
