import { Client } from "@elastic/elasticsearch";
import { Sex } from "@prisma/client";

export const getRandomPostsElasticSearchSerivce = (
    { index, size, sex, date }: { index: string; size: number; sex?: Sex; date: { gte: string; lte: string } },
    client: Client
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
};
