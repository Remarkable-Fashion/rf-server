import { Client } from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    const index = "posts";
    const size = 5;

    const now = new Date();

    // const firstMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // console.log("firstMonth :", firstMonth);
    // console.log("firstMonth :", firstMonth.toISOString());

    const date = now.toISOString();
    console.log(date);
    console.log(date.slice(0, -5));

    const rv = await client.search({
        index,
        body: {
            size,
            query: {
                bool: {
                    filter: {
                        range: {
                            timestamp: {
                                gte: "2023-07-01T00:00:00",
                                lte: date.slice(0, -5)
                                // "lte": "2023-07-04T23:59:59",
                            }
                        }
                    },
                    must: {
                        function_score: {
                            functions: [
                                {
                                    random_score: {}
                                }
                            ]
                        }
                    }
                }
            }
        }
        // body: {
        //     "size": size,
        //     "query": {
        //         "function_score": {
        //           "functions": [
        //             {
        //               "random_score": {}
        //             }
        //           ]
        //         }
        //     }
        // }
    });

    // console.log(rv.body.hits);
    console.log(rv.body.hits.hits);

    process.exit(1);
};

if (require.main === module) {
    main();
}
