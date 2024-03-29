import { EsClient } from "../../../db/elasticsearch";

export const getRecentSearchByUserIdService = async ({ index, userId, size }: { index: string; userId: number; size: number }, client: EsClient) => {
    const result = await client.search({
        index,
        body: {
            size,
            query: {
                term: {
                    // eslint-disable-next-line camelcase
                    user_id: {
                        value: userId
                    }
                }
            },
            // sort: [
            //     {
            //         timestamp: {
            //             order: "desc"
            //         }
            //     }
            // ],
            collapse: {
                field: "query.keyword",
                // eslint-disable-next-line camelcase
                inner_hits: {
                    name: "latest",
                    size: 1,
                    sort: [
                        {
                            timestamp: {
                                order: "desc"
                            }
                        }
                    ]
                }
            }
        }
    });

    return result;
};
