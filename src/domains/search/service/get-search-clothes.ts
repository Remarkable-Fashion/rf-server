import { EsClient } from "../../../db/elasticsearch";

export const getSearchClothesService = async ({ query, size, index, priceRange, colors, sex }: { query: string; size: number; index: string, priceRange?: number[]; colors?: string[]; sex?: string }, client: EsClient) => {

    const mustQueries: Record<string, any>[] = [
        {
            multi_match: {
                query,
                fields: ["name", "brand.keyword"]
            }
        }
    ];

    const shouldQueries: Record<string, any>[] = [];

    if(colors && colors.length){

        colors.forEach(color => {
            shouldQueries.push({
                term: {
                    "color.keyword": color
                }
            })
        })
    }

    if(sex){
        mustQueries.push({
            term: {
                "sex.keyword": sex
            }
        })
    }

    
    const filterQueries: Record<string, any>[] = [];

    if(priceRange){
        filterQueries.push({
            range: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1],
                }
            }
        });
    }

    const result = await client.search({
        index,
        body: {
            size,
            query: {
                bool: {
                    must: mustQueries,
                    filter: filterQueries,
                    should: shouldQueries,
                    "minimum_should_match": 1,
                    must_not: [
                        {
                            exists: {
                                field: "deleted_at"
                            }
                        }
                    ]
                }
            }
        }
    });

    return result.body.hits.hits.map((post: any) => {
        return post._source;
    });
};
