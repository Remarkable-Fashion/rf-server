import {Client} from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true,
    });

    const id = "timestamp";
    const rv = await client.ingest.putPipeline({
        id,
        body: {
            "description": "Creates a timestamp when a document is initially indexed",
            "processors": [
                {
                    "set": {
                        "field": "_source.timestamp",
                        "value": "{{_ingest.timestamp}}"
                    }
                }
            ]
        }
    });

    process.exit(1);
    
}

if(require.main === module){
    main();
}