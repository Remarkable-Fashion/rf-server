import type { Request, Response } from "express";
import { mongo } from "../../../db/mongodb";
import { createYearMonthString } from "../../../lib/create-date";
import { getRandomPostsMongo as getRandomPostsMongoService } from "../service/get-random-posts";
import { POST_PRE_FIX } from "../types";
import { createCollectionName } from "../create-collection-name";

const DEFAULT_SIZE = 21;

type ReqQuery = {
    size?: string;
};
export const getRandomPosts = async ({ query: { size } }: Request<unknown, unknown, unknown, ReqQuery>, res: Response) => {
    const parsedSize = Number(size);
    // eslint-disable-next-line no-underscore-dangle
    const _size = size && !Number.isNaN(parsedSize) && parsedSize < DEFAULT_SIZE ? parsedSize : DEFAULT_SIZE;

    const collectionName = createCollectionName(createYearMonthString(), POST_PRE_FIX);
    const posts = await getRandomPostsMongoService(mongo.Db, collectionName, _size);

    res.json(posts);
};
