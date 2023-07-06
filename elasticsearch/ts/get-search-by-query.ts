import {Client} from "@elastic/elasticsearch";

const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true,
    });

    const index = "search_log";
    const query = "삼성전자";

    const rv = await client.search({
        index,
        body: {
          "size": 4,
          "query":{
              "multi_match": {
                "query": query,
                  "fields": [
                      "query"
                  ]
              }
          }
      }
    });

    console.log(rv.body.hits.hits);

    process.exit(1);
}

if(require.main === module){
    main();
}