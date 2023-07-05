import {Client} from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true,
    });

    const indexName = "search_log";

    const rv = await client.indices.exists({index: indexName});

    if(!rv.body){
        console.log("No Index");
        return;
    }

    const rv2 = await client.search({
        index: indexName,
        body: {
            "size": 1,
            "sort": [
              {
                "timestamp": {
                  "order": "desc"
                }
              }
            ]
        }
    });

    const id = rv2.body.hits.hits[0]._id;
    console.log(id);

    if(!id){
        console.log("No Id");
        return;
    }

    const nextId = String(Number(id) + 1);
    console.log("nextId :", nextId);

    const rv3 = await client.index({
        index: indexName,
        id: nextId,
        pipeline: "timestamp",
        body: {
            "query": "두나무"
        }
    });

    console.log(rv3);
    
    process.exit(1);
}

if(require.main === module){
    main();
}