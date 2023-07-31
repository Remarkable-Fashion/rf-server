import { EsClient } from "../../../db/elasticsearch";
import { AUTO_TIMESTAMP_PIPELINE } from "../../search/constants";

export const createPostElasticSearchService = ({ index, id, data }: { index: string; id: string; data: any }, client: EsClient) => {
    return client.index({
        index,
        id,
        pipeline: AUTO_TIMESTAMP_PIPELINE,
        body: {
            ...data
        }
    });
};
