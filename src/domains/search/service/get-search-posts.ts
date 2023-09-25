import { EsClient } from "../../../db/elasticsearch";

export const ORDER = ["recent", "best"] as const;
export type Order = typeof ORDER[number];
// 인기순 최신순.
export const getSearchPostsService = async ({ query, sex, size, index, order, next }: { query: string; sex?: string; size: number; index: string; order: Order; next?: number[] }, client: EsClient) => {

    const mustQueries: Record<string, any>[] = [
        {
            multi_match: {
                query,
                fields: ["description"]
            }
        }
    ];

    if(sex){
        mustQueries.push({
            term: {
                "sex.keyword": sex
            }
        })
    }

    const isCursor = !!(next && next.length > 0);
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
    }

    const result = await client.search({
        index,
        body: {
            size,
            track_total_hits: size + 1,
            query: {
                // eslint-disable-next-line camelcase
                bool: {
                    must: mustQueries,
                    must_not: [
                        {
                            exists: {
                                field: "deleted_at"
                            }
                        }
                    ]
                }
            },
            sort: sort,
            ...(isCursor && {
                search_after: next 
            })
        }
    });
    const posts = result.body.hits.hits.map((post: any) => {
        return post._source;
    });

    return {
        hasNext: !!(size < result.body.hits.total.value),
        posts,
        sort: result.body.hits.hits.length 
        ? result.body.hits.hits[result.body.hits.hits.length - 1].sort
        : undefined
    }
};
