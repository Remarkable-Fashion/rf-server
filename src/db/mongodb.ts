/* eslint-disable no-underscore-dangle */
import { MongoClient, Db } from "mongodb";
import { conf } from "../config";

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

    collection(name: string) {
        if (!this._db) {
            throw new Error("Check your database exists");
        }
        return this._db.collection(name);
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

        const sales = mongo.collection("sales");

        const all = await sales.find({}).toArray();

        console.log("all :", all);

        // 검색 엔진 테스트
        const limit = 5;
        const searchResults = await sales
            .aggregate([
                {
                    $search: {
                        index: "a_few_fields",
                        text: {
                            query: "abc",
                            path: "item",
                            fuzzy: {}
                        }
                    }
                },
                {
                    $limit: limit
                }
            ])
            .toArray();

        console.log("searchResults :", searchResults);
    })();
}
