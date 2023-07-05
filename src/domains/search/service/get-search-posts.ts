import { Client } from "@elastic/elasticsearch";

// const DEFAULT_INDEX = "posts";
export const getSearchPostsService = async ({query, size, index}: {query: string, size: number, index: string}, client: Client) => {
    const result = await client.search({
        index,
        body: {
          "size": size,
          "query":{
              "multi_match": {
                "query": query,
                  "fields": [
                      "title", "description"
                  ]
              }
          }
        }
    });

    return result;
}