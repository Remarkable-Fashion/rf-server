import {Client, ApiError} from "@elastic/elasticsearch";

/**
 * @description
 * 인기검색어 로그에 활용.
 */
const main = async () => {
    const client = new Client({
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true,
    });

    const now = new Date();
    const date = now.toISOString();
    const slicedDate = date.slice(0, -5);

    const index = "search_log";
    const rv = await client.search({
        index,
        body: {
            "size": 0,
            "aggs": {
              "date_range_filter": {
                "filter": {
                  "range": {
                    "timestamp": {
                      // @TODO 5분주기로 검색을 할 때
                      // gte < 시간 < lte
                      // 사이의 시간을 가져올 텐데
                      // lte는 현재 시간으로 하고
                      // gte는 현지시간에서 일주일을 빼서 할까?
                      "gte": "2023-07-01T00:00:00",
                      "lte": "2023-07-02T00:00:00",
                      // "lte": slicedDate,
                    }
                  }
                },
                "aggs": {
                  "popular_keywords": {
                    "terms": {
                      "field": "query",
                      "size": 5
                    }
                  }
                }
              }
            }
            // "aggs": {
            //   "popular_keywords": {
            //     "terms": {
            //       "field": "query",
            //       "size": 5
            //     }
            //   }
            // }
        }
    });

    console.log(rv.body.aggregations.date_range_filter.popular_keywords.buckets);
    // console.log(rv.body.aggregations.popular_keywords.buckets);

    process.exit(1);
}

if(require.main === module){
    main();
}