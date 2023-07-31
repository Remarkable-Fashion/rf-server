import { EsClient } from "../../../db/elasticsearch";

export const getIndexListService = async (client: EsClient) => {
    const rv = await client.cat.indices({ format: "json" });

    const indexNames = rv.body.map((a: any) => {
        return a.index;
    });

    return indexNames;
};
