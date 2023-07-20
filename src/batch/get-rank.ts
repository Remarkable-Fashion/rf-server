import * as redis from "redis";
import { getSearchRankService } from "../domains/search/service/get-search-rank";
import { Client } from "@elastic/elasticsearch";
import { RANK_SIZE, SEARCH_LOG_INDEX, SEARCH_LOG_QUERY } from "../domains/search/constants";
import { getDateRange } from "../domains/search/get-date-range";

const esURL = "http://localhost:9200";
const redis_url = "redis://localhost:30001";
const main = async () => {
    const redisClient = redis.createClient({ url: redis_url });
    await redisClient.connect();

    const esClient = new Client({
        node: esURL,
        maxRetries: 5,
        requestTimeout: 60_000,
        sniffOnStart: true
    });

    const currentRank = await getSearchRankService(
        { query: SEARCH_LOG_QUERY, index: SEARCH_LOG_INDEX, date: getDateRange(new Date()), size: RANK_SIZE },
        esClient
    );

    console.log("currentRank :", currentRank);

    await esClient.close();
    await redisClient.quit();

    process.exit(1);
};

if (require.main === module) {
    main();
}

type Rank = { key: string; doc_count: number };