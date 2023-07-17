import { Client } from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    const rv = await client.cat.indices({ format: "json" });

    const indexNames = rv.body.map( (a: any)=>{
        return a.index;
    });

    console.log("indexNames :", indexNames);
    // console.log("plugins :", plugins.body);
};

main();
