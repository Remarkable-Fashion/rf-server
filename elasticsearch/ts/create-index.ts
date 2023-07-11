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
    const indexName = "clothes";
    const rv = await client.indices.exists({ index: indexName });

    console.log("rv :", rv.body);
    if (rv.body) {
        console.log("Alread exist");
        return;
    }

    const indexConfig = {
        settings: {
            index: {
                analysis: {
                    tokenizer: {
                        nori_user_dict: {
                            type: "nori_tokenizer",
                            decompound_mode: "mixed",
                            discard_punctuation: "false"
                        }
                    },
                    filter: {
                        my_pos_f: {
                            type: "nori_part_of_speech",
                            stoptags: [
                                "E",
                                "IC",
                                "J",
                                "MAG",
                                "MAJ",
                                "MM",
                                "SP",
                                "SSC",
                                "SSO",
                                "SC",
                                "SE",
                                "XPN",
                                "XSA",
                                "XSN",
                                "XSV",
                                "UNA",
                                "NA",
                                "VSV"
                            ]
                        }
                    },
                    analyzer: {
                        my_analyzer: {
                            type: "custom",
                            tokenizer: "nori_user_dict",
                            filter: "my_pos_f"
                        }
                    }
                }
            }
        },
        mappings: {
            properties: {
                clothes_id: {
                    type: "integer"
                },
                name: {
                    type: "text",
                    fields: {
                        keyword: {
                            type: "keyword",
                            ignore_above: 256
                        }
                    }
                },
                brand: {
                    type: "text",
                    fields: {
                        keyword: {
                            type: "keyword",
                            ignore_above: 256
                        }
                    }
                },
                category: {
                    type: "keyword",
                },
                value: {
                    type: "integer"
                }
            }
        }
    };

    await client.indices.create({ index: indexName, body: indexConfig });
    console.log("CREATE INDEX SUCCESS");

    process.exit(1);
};

if (require.main === module) {
    main();
}
