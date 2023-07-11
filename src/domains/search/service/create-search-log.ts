import { Client } from "@elastic/elasticsearch";
import { AUTO_ID_TIMESTAMP_PIPELINE } from "../constants";

// const DEFAULT_PIPELINE = "id-timestamp";
export const createSearchLogService = async ({ query, index, userId }: { query: string; index: string; userId: number }, client: Client) => {
    const result = await client.index({
        index,
        pipeline: AUTO_ID_TIMESTAMP_PIPELINE,
        body: {
            user_id: userId,
            query
        }
    });

    return result;
};
