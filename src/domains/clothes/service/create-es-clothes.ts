import { Client } from "@elastic/elasticsearch";
import { AUTO_TIMESTAMP_PIPELINE, CLOTHES_INDEX } from "../../search/constants";
import { CreatePostReturn } from "../../posts/service/create-post";

export const createClothesElasticSearchService = (data: {index: string, clothes: CreatePostReturn["clothes"]}, client: Client) => {

    const datas = [];
    for(const clothes of data.clothes){
        const index = { index: { _index: CLOTHES_INDEX, _id: String(clothes.id) } };
        const data = {
            clothes_id: clothes.id,
            name: clothes.name,
            brand: clothes.brand,
            category: clothes.category
        };
        datas.push(index);
        datas.push(data);
    }

    // console.log("bf insert :", datas);
    

    return client.bulk({
        body: datas,
        pipeline: AUTO_TIMESTAMP_PIPELINE
    });
};
