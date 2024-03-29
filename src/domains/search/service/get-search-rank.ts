import { EsClient } from "../../../db/elasticsearch";

export const getSearchRankService = async (
    { query, index, date, size }: { query: string; index: string; date: { gte: string; lte: string }; size: number },
    client: EsClient
) => {
    const result = await client.search({
        index,
        body: {
            size: 0,
            query: {
                range: {
                    timestamp: {
                        gte: date.gte,
                        lte: date.lte
                    }
                }
            },
            aggs: {
                // eslint-disable-next-line camelcase
                popular_keywords: {
                    terms: {
                        field: `${query}.keyword`, // text filed shuld have keyword (subfield)
                        size
                    }
                }
            }
        }
    });

    return result.body.aggregations.popular_keywords.buckets || [];
};
