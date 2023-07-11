import * as redis from "redis";

const main = async () => {
    const redis_url = "redis://localhost:30001";
    const redisClient = redis.createClient({ url: redis_url });
    await redisClient.connect();

    const key = "search:rank";
    const result = await redisClient.get(key);
    if (!result) {
        console.log("No data");
        return;
    }
    // console.log("result :", result);
    const parsedResult = JSON.parse(result) as any[];
    // const rv = parsedResult.map(a => {
    //     return JSON.parse(a)
    // });
    console.log(parsedResult);

    await redisClient.quit();

    process.exit(1);
};

if (require.main === module) {
    main();
}

type Rank = { key: string; doc_count: number };

const rankingChanges = (currentRanking: Rank[], previousRanking: Rank[]) => {
    return currentRanking.map((currentItem, currentIndex) => {
        const previousIndex = previousRanking.findIndex((item) => item.key === currentItem.key);
        const previousItem = previousRanking[previousIndex];

        const rankChange = previousIndex !== -1 ? previousIndex - currentIndex : null;
        return { ...currentItem, rankChange };
    });
};

// rankingChanges.forEach(item => {
//     const { key, doc_count, rankChange } = item;
//     const changeIndicator = rankChange !== null ? (rankChange > 0 ? '▲' : '▼') : '';
//     console.log(`${key} (${doc_count}) ${changeIndicator}`);
//   });
