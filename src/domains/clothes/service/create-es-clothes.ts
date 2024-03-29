import { AUTO_TIMESTAMP_PIPELINE, CLOTHES_INDEX } from "../../search/constants";
import { CreatePostReturn } from "../../posts/service/create-post";
import { EsClient } from "../../../db/elasticsearch";

export const createClothesElasticSearchService = (data: { index: string; clothes: CreatePostReturn["clothes"] }, client: EsClient) => {
    const datas = [];
    for (const clothes of data.clothes) {
        const index = { index: { _index: CLOTHES_INDEX, _id: String(clothes.id) } };
        const indexData = {
            // eslint-disable-next-line camelcase
            clothes_id: clothes.id,
            name: clothes.name,
            brand: clothes.brand,
            category: clothes.category
        };
        datas.push(index);
        datas.push(indexData);
    }

    // console.log("bf insert :", datas);

    return client.bulk({
        body: datas,
        pipeline: AUTO_TIMESTAMP_PIPELINE
    });
};
