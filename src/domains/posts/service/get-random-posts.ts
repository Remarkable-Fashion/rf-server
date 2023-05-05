import { Db } from "mongodb";

export const getRandomPostsMongo = (db: Db, collectionName: string, size: number) => {
    return db
        .collection(collectionName)
        .aggregate([
            {
                $sample: {
                    size
                }
            }
        ])
        .toArray();
};
