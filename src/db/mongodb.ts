/* eslint-disable no-underscore-dangle */
import { MongoClient, Db } from "mongodb";
import { conf } from "../config";
import { createYearMonthString } from "../lib/create-date";

class Mongo {
    private readonly client;

    private _db?: Db;

    private conn?: MongoClient;

    constructor(mongoURI: string, private readonly dbName: string) {
        this.client = new MongoClient(mongoURI);
    }

    async connect() {
        this.conn = await this.client.connect();

        this._db = this.db(this.dbName);

        console.log("MongoDB connection successful");
    }

    // collection(name: string) {
    //     if (!this._db) {
    //         throw new Error("Check your database exists");
    //     }
    //     return this._db.collection(name);
    // }

    get Db() {
        if (!this._db) {
            throw new Error("Check your database exists");
        }
        return this._db;
    }

    private db(dbName: string) {
        if (!this.conn) {
            throw new Error("Check your mongoDB connection");
        }

        return this.conn.db(dbName);
    }
}

export const mongo = new Mongo(conf().MONGO_URI, conf().MONGO_DB);

if (require.main === module) {
    (async () => {
        await mongo.connect();

        // const sales = mongo.collection("sales");

        // const all = await sales.find({}).toArray();

        // console.log("all :", all);

        // // 검색 엔진 테스트
        // @Issue 검색 엔진은 mysql로만 사용.
        // 동적으로 collection이 생길 때 마다 atlas에서 search index를 생성 해주어야한다.
        // 그러지 않으려면 미리 몇년치 collection을 생성하고 인덱스도 생성해 놓아야함.
        // mysql fulltext search로도 multi column으로 인덱스 생성가능.
        // const limit = 5;
        // const searchResults = await sales
        //     .aggregate([
        //         {
        //             $search: {
        //                 index: "a_few_fields",
        //                 text: {
        //                     query: "abc",
        //                     path: "item",
        //                     fuzzy: {}
        //                 }
        //             }
        //         },
        //         {
        //             $limit: limit
        //         }
        //     ])
        //     .toArray();
        // console.log("searchResults :", searchResults);

        const yearAndMonth = createYearMonthString();
        console.log(yearAndMonth);

        const preFix = "post";
        const colName = `${preFix}-${yearAndMonth}`;
        const col = mongo.Db.collection(colName);

        const testObj = {
            name: "testName",
            email: "test@gmail.com"
        };

        await col.insertOne(testObj);

        // const testObjs = [
        //     {
        //         name: "1"
        //     },
        //     {
        //         name: "2"
        //     },
        //     {
        //         name: "3"
        //     },
        //     {
        //         name: "4"
        //     },
        //     {
        //         name: "5"
        //     },
        //     {
        //         name: "6"
        //     },
        //     {
        //         name: "7"
        //     },
        //     {
        //         name: "8"
        //     },
        //     {
        //         name: "9"
        //     }
        // ];
        // await col.insertMany(testObjs);

        // const results = await col
        //     .aggregate([
        //         {
        //             $sample: {
        //                 size: 5
        //             }
        //         }
        //     ])
        //     .toArray();

        // console.log("results :", results);
    })();
}
