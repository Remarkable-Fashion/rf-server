import * as redis from "redis";
import { COUNTS_CLOTHES_LIKES_PREFIX, COUNTS_CLOTHE_LIKES_STREAM } from "../constants";
import prisma from "../db/prisma";

const PREFIX = COUNTS_CLOTHES_LIKES_PREFIX + ":";

const main = async () => {
    const now = new Date();
    console.log("START REDIS STREAM LOOP :", now.toISOString());

    const redisClient = redis.createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();

    let lastReadId = '0';

    async function readStream() {
        while (true) {
            await new Promise(async(resolve) => {
                const rv = await redisClient.xRead([{key: COUNTS_CLOTHE_LIKES_STREAM, id: lastReadId}], {BLOCK: 0});
                for ( const {id, message} of rv![0].messages){
                    // console.log("message :", id, message);
                    
                    // console.log("id :", id);
                    // console.log("clothe_id :", message.clothe_id);
                    // console.log("me? :", message);

                    const count = await redisClient.get(PREFIX + message.clothe_id);
                    if(!count){
                        console.log("check likes:clothe:", message.clothe_id);
                        resolve(true);
                        return;
                    }
                    // console.log("count :", count);
                    await prisma.clothes.update({
                        where: {
                            id: Number(message.clothe_id)
                        },
                        data: {
                            likeCount: Number(count)
                        }
                    });

                    await redisClient.XDEL(COUNTS_CLOTHE_LIKES_STREAM, id);

                    lastReadId = id;
                }
                console.log("lastReadId :", lastReadId);

                resolve(true);
            });
        }
    }

    // 초기화 코드
    readStream();  // 스트림 읽기 시작
};

if (require.main === module) {
    main();
}
