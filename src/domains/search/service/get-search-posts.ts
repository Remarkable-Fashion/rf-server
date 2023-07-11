import { Client } from "@elastic/elasticsearch";

// const DEFAULT_INDEX = "posts";
export const getSearchPostsService = async ({ query, size, index }: { query: string; size: number; index: string }, client: Client) => {
    const result = await client.search({
        index,
        body: {
            size,
            query: {
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
