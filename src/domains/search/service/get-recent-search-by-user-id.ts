import { Client } from "@elastic/elasticsearch";

export const getRecentSearchByUserIdService = async ({index, userId, size}: {index: string, userId: number, size: number}, client: Client) => {
    const result = await client.search({
        index,
        body: {
            "size": size,
            "query": {
                "term": {
                    "user_id": {
                        "value": userId
                    }
                }
            },
            "sort": [
                {
                    "timestamp": {
                        "order": "desc"
                    }
                }
            ]
        }
    });

    return result;
}