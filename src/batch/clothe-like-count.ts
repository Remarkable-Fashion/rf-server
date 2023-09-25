import * as redis from "redis";
import cron from "node-cron";
import { COUNTS_CLOTHES_LIKES_PREFIX, COUNTS_CLOTHE_LIKES_STREAM } from "../constants";
import prisma from "../db/prisma";

const CRON_EXPRESSION = "*/5 * * * *"; // 5분

const PREFIX = COUNTS_CLOTHES_LIKES_PREFIX + ":";
const DEFAULT_COUNT = 100;

const main = async () => {
    const now = new Date();
    console.log("START CRON JOB :", now.toISOString());

    const redisClient = redis.createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();

    // redis 트랜잭션 사용.
    const mulit = redisClient.multi();
    try {
        /**
         * @info 5분마다 스트림 읽고 like count에 반영 후 삭제
         * clothe에 좋아요하면 stream에 등록.
         */
        // XTRIM likes.clothe.stream MAXLEN 0 -> 삭제
        let id = "0";
        let _count = 0;
        
        do {
            const rv = await redisClient.xRead({key: COUNTS_CLOTHE_LIKES_STREAM, id: id}, {COUNT: DEFAULT_COUNT});
            if(!rv) {
                break;
            }
            const messages = rv![0].messages;
            const clotheIds = messages.map(i => i.message.clothe_id);
            const clotheIdsWithPrefix = clotheIds.map( id => PREFIX + id);
            const likeCounts = await redisClient.mGet(clotheIdsWithPrefix) as string[];

            // 2. clothe에 updateMany id -> count
            for(const [index, clotheId] of clotheIds.entries()){
                await prisma.clothes.update({
                    where: {
                        id: Number(clotheId)
                    },
                    data: {
                        likeCount: Number(likeCounts[index])
                    }
                });
            }
        
            id = messages[messages.length - 1].id;
            _count = messages.length;

        } while (_count === DEFAULT_COUNT);
        await redisClient.xTrim(COUNTS_CLOTHE_LIKES_STREAM, "MAXLEN", 0);
        await mulit.exec();

        console.log("SUCCESS CRON JOB");
    } catch {
        mulit.discard();
    } finally {
        
        await redisClient.quit();

        console.log("CLOSE CRON JOB");
    }
};

if (require.main === module) {
    // main();
    cron.schedule(CRON_EXPRESSION, async () => {
        try {
            await main();
        } catch (error) {
            console.log("err :", error);
        }
    });
}
