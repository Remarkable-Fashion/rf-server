import { Client } from "@elastic/elasticsearch";
import { AUTO_TIMESTAMP_PIPELINE } from "../../search/constants";

export const createPostElasticSearchService = ({ index, id, data }: { index: string; id: string; data: any }, client: Client) => {
    return client.index({
        index,
        id,
        pipeline: AUTO_TIMESTAMP_PIPELINE,
        body: {
            ...data
        }
    });
};
