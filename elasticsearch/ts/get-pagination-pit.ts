import { Client } from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    const rv = await client.openPointInTime({
        index: "search_log",
        keep_alive: "1m"
    })

    const pitId = rv.body.id;
    console.log("pitId :", pitId);

    const QUERY = "여르";


    const pitwithbody = await client.search({
        // index: "search_log",
        size: 5,
        body: {
            query: {
                match: {
                    "query": QUERY
                }
            },
            "pit": {
                id: pitId,
                keep_alive: "1m"
            },
            sort: [{ timestamp: { order: 'asc' } }]
        }
    });
    const list = pitwithbody.body.hits.hits;
    console.log("list :", list);

    const lastSort = list[list.length - 1].sort;

    const pitwithbody2 = await client.search({
        // index: "search_log",
        size: 5,
        body: {
            query: {
                match: {
                    "query": QUERY
                }
            },
            "pit": {
                id: pitId,
                keep_alive: "1m"
            },
            sort: [{ timestamp: { order: 'asc' } }],
            search_after: lastSort
        }
    });

    const nextList = pitwithbody2.body.hits.hits;
    const after = nextList[nextList.length - 1].sort;

    console.log("body :", nextList);
    console.log("body :", after);
    



};

main();
