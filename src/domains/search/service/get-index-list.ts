import { Client } from "@elastic/elasticsearch";

export const getIndexListService = async (client: Client) => {
    const rv = await client.cat.indices({ format: "json" });

    const indexNames = rv.body.map((a: any) => {
        return a.index;
    });

    return indexNames;
};
