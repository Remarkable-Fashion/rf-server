import { AUTO_ID_TIMESTAMP_PIPELINE, AUTO_TIMESTAMP_PIPELINE } from "../../../../domains/search/constants";
import { EsClient } from "../../../elasticsearch";

const createPipeLine = async (id: string, config: any, client: EsClient) => {
    await client.ingest.putPipeline({
        id,
        body: config
    });
};

export const createIdWithTimestampPipeline = async (client: EsClient) => {
    const config = {
        description: "Creates a timestamp and id when a document is initially indexed",
        processors: [
            {
                script: {
                    source: `
                        String getUUID(def str) {
                            def res = null;
                            if (str != null) {
                            char[] buffer = str.toCharArray();
                            byte[] b = new byte[buffer.length];
                            for (int i = 0; i < b.length; i++) {
                                b[i] = (byte) buffer[i];
                            }
                            res = UUID.nameUUIDFromBytes(b).toString();
                            } else {
                                // randomUUID does not work
                                //res = UUID.randomUUID().toString();
                                res = Math.random().toString();
                            }
                            return res;
                        }
                        
                        //
                        // Main
                        // params.field - the field name.
                        // Note: "doted" names (like "content.message") will not work.
                        //
                        if (ctx.containsKey(params.field) && !ctx[params.field].isEmpty()) {
                            ctx._id = getUUID(ctx[params.field]) + "." + getUUID(ctx[params.field].encodeBase64());
                        } else {
                            ctx._id = params.field + "_empty_" + getUUID(null);
                        }
                    `
                }
            },
            {
                set: {
                    field: "_source.timestamp",
                    value: "{{_ingest.timestamp}}"
                }
            }
        ]
    };

    await createPipeLine(AUTO_ID_TIMESTAMP_PIPELINE, config, client);
};

export const createTimestampPipeline = async (client: EsClient) => {
    const config = {
        description: "Creates a timestamp when a document is initially indexed",
        processors: [
            {
                set: {
                    field: "_source.timestamp",
                    value: "{{_ingest.timestamp}}"
                }
            }
        ]
    };

    await createPipeLine(AUTO_TIMESTAMP_PIPELINE, config, client);
};
