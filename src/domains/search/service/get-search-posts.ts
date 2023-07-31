import { EsClient } from "../../../db/elasticsearch";

// const DEFAULT_INDEX = "posts";
export const getSearchPostsService = async ({ query, size, index }: { query: string; size: number; index: string }, client: EsClient) => {
    const result = await client.search({
        index,
        body: {
            size,
            query: {
                // eslint-disable-next-line camelcase
                multi_match: {
                    query,
                    fields: ["title", "description"]
                }
            }
        }
    });

    return result.body.hits.hits.map((post: any) => {
        return post._source;
    });

    // return result;
};
