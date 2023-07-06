import { Client } from "@elastic/elasticsearch";


export const getLastSearchService = async ({index}:{index: string},client: Client) => {

    const result = await client.search({
        index,
        body: {
            "size": 1,
            "sort": [
                {
                    "timestamp": {
                        "order": "desc"
                    }
                }
            ]
        }
    });

    return result.body.hits.hits[0]._id;
}