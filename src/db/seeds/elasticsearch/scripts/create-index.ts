// import { Client } from "@opensearch-project/opensearch/.";
import { CLOTHES_INDEX, POSTS_INDEX, SEARCH_LOG_INDEX } from "../../../../domains/search/constants";
import { EsClient } from "../../../elasticsearch";

const createIndex = async (indexName: string, config: any, client: EsClient) => {
    const isIndexExist = await client.indices.exists({ index: indexName });
    if (isIndexExist.body) {
        console.log(`Index already exist : ${indexName}`);
        return;
    }

    await client.indices.create({
        index: indexName,
        body: config
    });
};

/**
 *
 * @info item 검색엔진
 */
/* eslint-disable camelcase */
export const createClothesIndex = async (client: EsClient) => {
    const config = {
        settings: {
            index: {
                max_ngram_diff: 12,
                analysis: {
                    tokenizer: {
                        seunjeon: {
                            type: "seunjeon_tokenizer",
                            // type: "nori_tokenizer",
                            decompound_mode: "mixed",
                            discard_punctuation: "false"
                        }
                        // "ngram_tokenizer": {
                        //     "type": "nGram",
                        //     "min_gram": 1,
                        //     "max_gram": 10,
                        //     "token_chars": ["letter", "digit"]
                        // }
                    },
                    // filter: {
                    //     my_pos_f: {
                    //         type: "seunjeon_tokenizer",
                    //         // type: "synonym",
                    //         // tokenizer: "seunjeon_tokenizer",
                    //         stoptags: [
                    //             "E",
                    //             "IC",
                    //             "J",
                    //             "MAG",
                    //             "MAJ",
                    //             "MM",
                    //             "SP",
                    //             "SSC",
                    //             "SSO",
                    //             "SC",
                    //             "SE",
                    //             "XPN",
                    //             "XSA",
                    //             "XSN",
                    //             "XSV",
                    //             "UNA",
                    //             "NA",
                    //             "VSV"
                    //         ]
                    //     }
                    // },
                    analyzer: {
                        my_analyzer: {
                            type: "custom",
                            tokenizer: "seunjeon"
                            // tokenizer: "nori_user_dict",
                            // filter: "my_pos_f"
                        }
                        // "ngram_analyzer": {
                        //     "tokenizer": "ngram_tokenizer"
                        // }
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
                    analyzer: "my_analyzer",
                    fields: {
                        keyword: {
                            type: "keyword",
                            ignore_above: 256
                        }
                    }
                },
                brand: {
                    type: "text",
                    analyzer: "my_analyzer",
                    fields: {
                        keyword: {
                            type: "keyword",
                            ignore_above: 256
                        }
                    }
                },
                category: {
                    type: "keyword"
                },
                value: {
                    type: "integer"
                }
            }
        }
    };

    await createIndex(CLOTHES_INDEX, config, client);
};

export const createPostIndex = async (client: EsClient) => {
    /**
     * @info
     * @title text
     * @description text
     */
    const config = {
        settings: {
            index: {
                analysis: {
                    tokenizer: {
                        seunjeon: {
                            // nori_user_dict: {
                            type: "seunjeon_tokenizer",
                            // type: "nori_tokenizer",
                            decompound_mode: "mixed",
                            discard_punctuation: "false"
                        }
                    },
                    // filter: {
                    //     my_pos_f: {
                    //         type: "seunjeon_tokenizer",
                    //         // type: "synonym",
                    //         // tokenizer: "seunjeon_tokenizer",
                    //         stoptags: [
                    //             "E",
                    //             "IC",
                    //             "J",
                    //             "MAG",
                    //             "MAJ",
                    //             "MM",
                    //             "SP",
                    //             "SSC",
                    //             "SSO",
                    //             "SC",
                    //             "SE",
                    //             "XPN",
                    //             "XSA",
                    //             "XSN",
                    //             "XSV",
                    //             "UNA",
                    //             "NA",
                    //             "VSV"
                    //         ]
                    //     }
                    // },
                    analyzer: {
                        my_analyzer: {
                            type: "custom",
                            tokenizer: "seunjeon"
                            // filter: "my_pos_f"
                        }
                    }
                }
            }
        },
        mappings: {
            properties: {
                title: {
                    type: "text",
                    analyzer: "my_analyzer"
                },
                description: {
                    type: "text",
                    analyzer: "my_analyzer"
                },
                sex: {
                    type: "keyword"
                }
            }
        }
    };

    await createIndex(POSTS_INDEX, config, client);
};

// eslint-disable-next-line camelcase
export const createSearchLogIndex = async (client: EsClient) => {
    /**
     * @info
     * @user_id integer
     * @query text with subtype keyword
     */
    const config = {
        settings: {
            index: {
                analysis: {
                    tokenizer: {
                        seunjeon: {
                            type: "seunjeon_tokenizer",
                            decompound_mode: "mixed",
                            discard_punctuation: "false"
                        }
                    },
                    // filter: {
                    //     my_pos_f: {
                    //         type: "seunjeon_tokenizer",
                    //         // type: "synonym",
                    //         // tokenizer: "seunjeon_tokenizer",
                    //         stoptags: [
                    //             "E",
                    //             "IC",
                    //             "J",
                    //             "MAG",
                    //             "MAJ",
                    //             "MM",
                    //             "SP",
                    //             "SSC",
                    //             "SSO",
                    //             "SC",
                    //             "SE",
                    //             "XPN",
                    //             "XSA",
                    //             "XSN",
                    //             "XSV",
                    //             "UNA",
                    //             "NA",
                    //             "VSV"
                    //         ]
                    //     }
                    // },
                    analyzer: {
                        my_analyzer: {
                            type: "custom",
                            tokenizer: "seunjeon"
                            // filter: "my_pos_f"
                        }
                    }
                }
            }
        },
        mappings: {
            properties: {
                user_id: {
                    type: "integer"
                },
                query: {
                    type: "text",
                    fields: {
                        keyword: {
                            type: "keyword",
                            ignore_above: 256
                        }
                    }
                }
            }
        }
    };

    await createIndex(SEARCH_LOG_INDEX, config, client);
};

if (require.main === module) {
    // const client = new Client({
    //     node: "http://localhost:9200",
    //     maxRetries: 5,
    //     requestTimeout: 60000,
    //     sniffOnStart: true
    // });
    // createClothesIndex(client).then(() => {
    //     console.log("Success create Index");
    // });
}
