import { Client } from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    // const indexName = "search_log";
    const indexName = "test-nori";

    const indexConfig = {
        settings: {
            "index":{
                "max_ngram_diff": 12
            },
            "analysis": {
                "analyzer": {
                    "ngram_analyzer": {
                        "tokenizer": "ngram_tokenizer"
                    }
                },
                "tokenizer": {
                    "ngram_tokenizer": {
                        "type": "nGram",
                        "min_gram": 1,
                        "max_gram": 10,
                        "token_chars": ["letter", "digit"]
                    }
                }
            }
        },
        mappings: {
                "properties": {
                    "title": {
                        "type": "text",
                        "analyzer": "ngram_analyzer"
                    },
                    "description": {
                        "type": "text",
                        "analyzer": "ngram_analyzer"
                    }
                }
            
        }
    };

    const idTimeStamp = "id-timestamp";


    // await client.indices.create({ index: indexName, body: indexConfig });
    // console.log("CREATE INDEX SUCCESS");

    // await client.index({
    //     index: indexName,
    //     body: {
    //         title: "신발",
    //         description: "여름에 신을 시원한 신발~",
    //     },
    //     pipeline: idTimeStamp
    // });

    // await client.index({
    //     index: indexName,
    //     body: {
    //         title: "여르 신발",
    //         description: "여름에 신을 시원한 신발~",
    //     },
    //     pipeline: idTimeStamp
    // });

    // await client.index({
    //     index: indexName,
    //     body: {
    //         title: "가을 신발",
    //         description: "가을 멋쟁이 신발~",
    //     },
    //     pipeline: idTimeStamp
    // });

    // await client.index({
    //     index: indexName,
    //     body: {
    //         title: "여르메 신발",
    //         description: "따땃한 shoes~",
    //     },
    //     pipeline: idTimeStamp
    // });

    const result = await client.search({
        index: indexName,
        body: {
            query: {
                bool: {
                    should: [
                        {
                            "match": {
                                "title": {
                                    query: "여름 옷",
                                    boost: 2
                                }
                            }
                        },
                        {
                            "match_phrase": {
                                "description": {
                                    query: "여름 옷",
                                    slop: 1
                                }
                            }
                        },
                    ]
                }
            }
        }
    });
    console.log(result.body.hits.hits);


    process.exit(1);
};

if (require.main === module) {
    main();
}
