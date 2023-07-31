import { Client } from "@opensearch-project/opensearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200"
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
