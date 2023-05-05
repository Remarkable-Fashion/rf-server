import { Db } from "mongodb";

export const createPostMongo = (post: Record<string, any>, db: Db, collectionName: string) => {
    return db.collection(collectionName).insertOne(post);
};
