import { Client } from "@elastic/elasticsearch";

export const getSearchClothesService = async ({ query, size, index }: { query: string; size: number; index: string }, client: Client) => {
    const result = await client.search({
        index,
        body: {
            size,
            query: {
                multi_match: {
                    query,
                    fields: ["name", "brand"]
                }
            }
        }
    });

    return result.body.hits.hits.map((post: any) => {
        return post._source;
    });

    // return result;
};
