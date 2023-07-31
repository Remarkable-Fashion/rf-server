import { Sex } from "@prisma/client";
import { EsClient } from "../../../db/elasticsearch";

export const getRandomPostsElasticSearchSerivce = (
    { index, size, sex, date }: { index: string; size: number; sex?: Sex; date: { gte: string; lte: string } },
    client: EsClient
) => {
    return client.search({
        index,
        body: {
            size,
            query: {
                bool: {
                    filter: [
                        sex && {
                            term: {
                                sex
                            }
                        },
                        {
                            range: {
                                timestamp: {
                                    gte: date.gte,
                                    lte: date.lte
                                }
                            }
                        }
                    ],
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
                    }
                }
            }
        }
    });
};
