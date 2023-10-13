import prisma from "../db/prisma";
import cron from "node-cron";

const CRON_EXPRESSION = "* */2 * * *"; // 5분
/**
 * @info AWS dms가 mysql binlog를 불러오는데 binlog의 유지기간이 24시간이다.
 * 때문에 24시간 후 비어있는 빈로그를 찾으려는 dms가 오류로 멈추게 되는 것을 방지한다.
 */
const main = async () => {
    const now = new Date();
    console.log("START CREATE POST  LOOP :", now.toISOString());

    const userId = 2;

    const postWithClothes = await prisma.posts.create({
        data: {
            userId,
            description: "dms 정지 방지.",
            isPublic: false,
            clothes: {
                create: {
                    category: "Top",
                    name: "dms 정지 방지",
                    price: 100,
                    deletedAt: now
                }
            }
        }
    });

    // console.log("postWithClothes :", postWithClothes);

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
