import {Client} from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true,
    });

    const id = "id-timestamp";

    try {
        await client.ingest.getPipeline({id});
        console.log("Already exist");
        return;
    } catch (error) {
        // console.log("")
    }
    console.log("Continue");


    const rv = await client.ingest.putPipeline({
        id,
        body: {
            "description": "Creates a timestamp and id when a document is initially indexed",
            "processors": [
                {
                    "script": {
                        "source": `
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
                    "set": {
                        "field": "_source.timestamp",
                        "value": "{{_ingest.timestamp}}"
                    }
                }
            ]
        }
    });

    console.log("rv :", rv.body);

    process.exit(1);
    
}

if(require.main === module){
    main();
}