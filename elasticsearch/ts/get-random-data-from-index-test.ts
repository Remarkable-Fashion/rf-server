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
    const size = 2;

    const now = new Date();

    const date = now.toISOString();
    console.log(date);
    console.log(date.slice(0, -5));

    const rv = await client.search({
        index,
        body: {
            size,
            query: {
                bool: {
                    filter: [
                        {
                            term: {
                                sex: "Male"
                            }
                        },
                        {
                            range: {
                                timestamp: {
                                    gte: "2023-07-01T00:00:00",
                                    // "lte": date.slice(0, -5),
                                    lte: "2023-07-11T23:59:59"
                                }
                            }
                        }
                    ],
                    // "filter": {
                    //     "range": {
                    //         "timestamp": {
                    //             "gte": "2023-07-01T00:00:00",
                    //             "lte": date.slice(0, -5),
                    //             // "lte": "2023-07-04T23:59:59",
                    //         }
                    //     }
                    // },
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
    });

    // {
    //     "term": {
    //         "sex": "Male"
    //     }
    // },
    // {
    //     "range": {
    //         "timestamp": {
    //             "gte": "2023-07-01T00:00:00",
    //             "lte": date.slice(0, -5),
    //             // "lte": "2023-07-04T23:59:59",
    //         }
    //     }
    // }

    console.log(rv);
    console.log(rv.body.hits.hits);

    process.exit(1);
};

if (require.main === module) {
    main();
}
