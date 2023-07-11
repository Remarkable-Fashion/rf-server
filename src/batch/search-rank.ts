import { Client } from "@elastic/elasticsearch";
import * as redis from "redis";
import cron from "node-cron";
import { SEARCH_LOG_QUERY, SEARCH_LOG_INDEX, REDIS_SEARCH_RANK_KEY } from "../domains/search/constants";
import { getSearchRankService } from "../domains/search/service/get-search-rank";
import { Rank } from "../domains/search/types";
import { getDateRange } from "../domains/search/get-date-range";

const RANK_SIZE = 5;
const CRON_EXPRESSION = "*/5 * * * *"; // 5분

const redisURL = "redis://localhost:30001";
const esURL = "http://localhost:9200";

const main = async () => {
    const now = new Date();
    console.log("START CRON JOB :", now.toISOString());

    const redisClient = redis.createClient({ url: redisURL });
    await redisClient.connect();

    const esClient = new Client({
        node: esURL,
        maxRetries: 5,
        requestTimeout: 60_000,
        sniffOnStart: true
    });

    try {
        const currentRank = await getSearchRankService(
            { query: SEARCH_LOG_QUERY, index: SEARCH_LOG_INDEX, date: getDateRange(new Date()), size: RANK_SIZE },
            esClient
        );

        const _previousRank = await redisClient.get(REDIS_SEARCH_RANK_KEY);
        let previousRank: Rank[] = [];
        if (!_previousRank) {
            console.log("No data");
        } else {
            previousRank = JSON.parse(_previousRank) as Rank[];
            // const previousRank = typia.assertParse<Rank[]>(_previousRank);
            console.log("previousRank :", previousRank);
        }

        // const currentRank = esSearchRank.body.aggregations.popular_keywords.buckets;
        const result = rankingChanges(currentRank, previousRank);
        console.log("result :", result);

        const data = JSON.stringify(result);
        // const data = typia.stringify(result);
        await redisClient.set(REDIS_SEARCH_RANK_KEY, data);
        console.log("SUCCESS CRON JOB");
    } catch (e) {
        throw e;
    } finally {
        await redisClient.quit();
        await esClient.close();

        console.log("CLOSE CRON JOB");
    }
};

if (require.main === module) {
    cron.schedule(CRON_EXPRESSION, async () => {
        try {
            await main();
        } catch (error) {
            console.log("err :", error);
        }
    });
}

const rankingChanges = (currentRanking: Rank[], previousRanking: Rank[]) => {
    return currentRanking.map((currentItem, currentIndex) => {
        const previousIndex = previousRanking.findIndex((item) => item.key === currentItem.key);
        // const previousItem = previousRanking[previousIndex];

        const rankChange = previousIndex !== -1 ? previousIndex - currentIndex : null;

        const { key, doc_count } = currentItem;
        let changeIndicator = "new";

        if (rankChange !== null) {
            if (rankChange > 0) {
                changeIndicator = `+${rankChange}`;
                // changeIndicator = `▲ (+${rankChange})`;
            } else if (rankChange < 0) {
                changeIndicator = `${rankChange}`;
                // changeIndicator = `▼ (${rankChange})`;
            } else {
                changeIndicator = "─";
            }
        }
        return {
            key,
            doc_count,
            changeIndicator
        };
    });
};
