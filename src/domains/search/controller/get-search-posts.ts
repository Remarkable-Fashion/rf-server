import type { Request, Response } from "express";
import { BadReqError } from "../../../lib/http-error";
import { client } from "../../../db/elasticsearch";
import { getSearchPostsService, ORDER, Order } from "../service/get-search-posts";
import { createSearchLogService } from "../service/create-search-log";
import { POSTS_INDEX, RECENT_SEARCH_SIZE, SEARCH_LOG_INDEX } from "../constants";
import Prisma from "../../../db/prisma";
import { getPostsByIdsService } from "../../posts/service/get-random-posts";
import { RedisSingleton } from "../../../db/redis";

const validateTake = (take?: string) => {
    if (!take) {
        throw new BadReqError("No 'take' query string");
    }

    const parsedTake = Number(take);
    if (Number.isNaN(parsedTake)) {
        throw new BadReqError("'take' should be Number");
    }

    if (parsedTake <= 0 || parsedTake > 20) {
        throw new BadReqError("'take' should be 0 to 20");
    }

    return parsedTake;
};

const validateSex = (sex?: string) => {
    if(!sex){
        return;
    }
    if(sex !== "Male" && sex !== "Female"){
        throw new BadReqError("Sex must be Male or Female");
    }
    return sex;
};

// const ORDER = ["recent", "best"] as const;

const validateOrder = (order?: string) => {
    if(!order){
        return "recent";
    }
    if(!ORDER.includes(order as any)){
        throw new BadReqError("order must be recent or best");
    }
    return order as Order;
}

const isNumber = (str: string) => {
    const num = Number(str);

    if(Number.isNaN(num)){
        throw new BadReqError(`cursor must be number : ${num}`);
    }
    return num;
}

const validateCursor = (cursor?: string | string[]) => {
    if(!cursor) {
        return [];
    }

    if(Array.isArray(cursor)){
        return cursor.map(isNumber);
    }

    return [isNumber(cursor)];
}

export const getSearchPosts = async (req: Request<unknown, unknown, unknown, { search?: string; take?: string; sex?: string; order?: string; cursor?: string }>, res: Response) => {
    const query = req.query.search;
    if (!query) {
        throw new BadReqError("No 'Search' query string");
    }
    const take = validateTake(req.query.take);
    const sex = validateSex(req.query.sex);
    const order = validateOrder(req.query.order);
    const cursor = validateCursor(req.query.cursor);
    console.log("cursor :", cursor);

    const {posts, hasNext, sort} = await getSearchPostsService({ query, size: take, sex, index: POSTS_INDEX, order, next: cursor }, client);

    const redisSearch = `${SEARCH_LOG_INDEX}:${req.id}`;
    await (await RedisSingleton.getClient()).lPush(redisSearch, query);
    await (await RedisSingleton.getClient()).lTrim(redisSearch, RECENT_SEARCH_SIZE - 10, RECENT_SEARCH_SIZE - 1);

    await createSearchLogService({ query, index: SEARCH_LOG_INDEX, userId: req.id }, client);

    const ids = posts.map((post: any) => {
        return post.id;
    }) as number[];

    if (ids.length <= 0) {
        const data = {
            cursor,
            hasNext: false,
            size: 0,
            search: query,
            take,
            posts: []
        };

        res.json(data);
        return;
    }

    const postsT = await getPostsByIdsService({ userId: req.id, postIds: ids, order }, Prisma);

    const data = {
        cursor,
        nextCursor: sort,
        hasNext,
        size: postsT.length,
        search: query,
        take,
        posts: postsT
    };

    res.status(200).json(data);
};
