import { EsClient } from "../../../db/elasticsearch";
import { AUTO_ID_TIMESTAMP_PIPELINE } from "../constants";

// const DEFAULT_PIPELINE = "id-timestamp";
export const createSearchLogService = async ({ query, index, userId }: { query: string; index: string; userId: number }, client: EsClient) => {
    const result = await client.index({
        index,
        pipeline: AUTO_ID_TIMESTAMP_PIPELINE,
        body: {
            // eslint-disable-next-line camelcase
            user_id: userId,
            query
        }
    });

    return result;
};
