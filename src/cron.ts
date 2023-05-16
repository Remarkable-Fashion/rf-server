import { mongo } from "./db/mongodb"
import { createCollectionName } from "./domains/posts/create-collection-name"
import { POST_PRE_FIX } from "./domains/posts/types"
import { createYearMonthString } from "./lib/create-date"
import cron from "node-cron";

const main = async () => {
    await mongo.connect()
    const db = mongo.Db

    const cronCb = async () => {
        const date = new Date()
        if(date.getDate() > 7){
            console.log("매달 첫번째 화요일 오전 4시에 실행됩니다.")
            return
        }
        const collectionName = createCollectionName(createYearMonthString(date), POST_PRE_FIX)
        await db.collection(collectionName).drop()
    }

    const cronExpression = "0 4 * * 2" // 매주 화요일 오전 4시
    // const cronExpression = "*/5 * * * * *" // 5초
    const cronId = cron.schedule(cronExpression, cronCb)
}


if(require.main === module){
    main()
}