import { Sex } from "@prisma/client";
import { EsClient } from "../../../db/elasticsearch";
import { Order } from "../../search/service/get-search-posts";

export const getRandomPostsElasticSearchSerivce = (
    { index, size, sex, date, order, heights, weights }: { index: string; size: number; sex?: Sex; date: { gte: string; lte: string }, order?: Order, heights?: number[], weights?: number[] },
    client: EsClient
) => {

    const sort: Record<string, any>[] = [];

    if(order === "recent"){
        sort.push({
            "created_at": {
                order: "desc"
            }
        });
    } else if(order === "best"){
        sort.push({
            "like_count": {
                order: "desc"
            }
        });

        sort.push({
            "created_at": {
                order: "desc"
            }
        });
    } else {
        sort.push({
            "created_at": {
                order: "desc"
            }
        });
    }

    const filterQueries: Record<string, any>[] = [
        {
            term: {
                "is_public": 1
            }
        },
        {
            range: {
                created_at: {
                // timestamp: {
                    gte: date.gte,
                    lte: date.lte
                }
            }
        }
    ];

    if(heights){
        filterQueries.push({
            range: {
                height: {
                    gte: heights[0],
                    lte: heights[1],
                }
            }
        });
    }

    if(weights){
        filterQueries.push({
            range: {
                weight: {
                    gte: weights[0],
                    lte: weights[1],
                }
            }
        });
    }

    if(sex){
        filterQueries.push({
            term: {
                // @INFO aws opensearch로 cdc를 하는 경우 동적 맵핑으로 인해 sex의 타입이 `text`로 생성된다.
                // sex
                'sex.keyword': sex
            },
        })
    }

    return client.search({
        index,
        body: {
            size,
            query: {
                bool: {
                    filter: filterQueries,
                    must: {
                        // eslint-disable-next-line camelcase
                        function_score: {
                            functions: [
                                {
                                    // eslint-disable-next-line camelcase
                                    random_score: {}
                                }
                            ]
                        }
                    },
                    must_not: [
                        {
                            exists: {
                                field: "deleted_at"
                            }
                        }
                    ]
                }
            },
            sort: sort
        }
    });
};
