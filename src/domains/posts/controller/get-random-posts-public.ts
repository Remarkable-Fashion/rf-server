import type { Request, Response } from "express";
import typia from "typia";
import { postSex } from "../types";
import { BadReqError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getRandomPostsPublicService } from "../service/get-random-posts-public";
import { getRandomPostsElasticSearchSerivce } from "../service/get-random-posts-elasticsearch";
import { client } from "../../../db/elasticsearch";
import { POSTS_INDEX } from "../../search/constants";
import { redisClient, RedisClient } from "../../../db/redis";
import { PrismaClient } from "@prisma/client";

const CACHE_POST_PREFIX = "cache:post:";
const CACHE_POST_EXPIRE = 3600; // 60 * 60 초

const DEFAULT_SIZE = 21;

type ReqQuery = {
    take?: string;
    sex?: string;
};

type ReqType = {
    sex?: typeof postSex[number] | "All";
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
    type PostArray = UnwrapPromise<ReturnType<typeof getRandomPostsPublicService>>;
    type Posts = PostArray[number];

const validateQueryTake = (take?: string) => {
    if (!take) {
        return DEFAULT_SIZE;
        // throw new BadReqError("No 'take'");
    }
    const parsedTake = Number(take);

    if (Number.isNaN(parsedTake)) {
        throw new BadReqError("'take' query should be number");
    }

    if (parsedTake <= 0 || parsedTake > DEFAULT_SIZE) {
        throw new BadReqError(`'take' should be 0 to ${DEFAULT_SIZE}`);
    }

    return parsedTake;
};

const validateQuerySex = (sex?: string) => {
    const result = typia.validateEquals<ReqType>({ sex });

    if (!result.success) {
        throw new BadReqError("Check your 'sex' query, should be 'Male' or 'Female'");
    }

    if(result.data.sex === "All"){
        return;
    }

    return result.data.sex;
};

function getPastDateISOString(days: number, now?: Date) {
    const currentDate = now || new Date(); // 현재 날짜 및 시간 가져오기
    const pastDate = new Date(currentDate); // 현재 날짜 및 시간을 복사하여 새로운 객체 생성
    pastDate.setDate(currentDate.getDate() - days); // 지정된 일 수 이전의 날짜로 설정

    const isoString = pastDate.toISOString().slice(0, -5); // ISO 문자열로 변환
    return isoString;
}

export const getRandomPostsPublic = async (req: Request<unknown, unknown, unknown, ReqQuery>, res: Response) => {
    const take = validateQueryTake(req.query.take);
    const sex = validateQuerySex(req.query.sex);

    const now = new Date();
    const thirtyDaysAgoISOString = getPastDateISOString(30, now);
    const nowISOString = now.toISOString().slice(0, -5);

    const dateRange = {
        gte: thirtyDaysAgoISOString,
        lte: nowISOString
    };

    const elkPosts = await getRandomPostsElasticSearchSerivce({ index: POSTS_INDEX, size: take, sex, date: dateRange }, client);

    const ids = elkPosts.body.hits.hits.map(({ _source: { id } }: any) => {
        return id;
    }) as number[];

    if (ids.length <= 0) {
        const data = {
            size: 0,
            // totalCounts: posts.length,
            take,
            sex: sex || "NONE",
            posts: []
        };
        res.json(data);
        return;
    }

    
    const postMap = new Map<number, Posts | null>();
    ids.forEach(id => {
        postMap.set(id, null);
    });

    await getCachedPosts(ids, postMap, redisClient);
    await setPostCache(postMap, redisClient, Prisma)


    const posts = Array.from(postMap.values());

    const data = {
        size: posts.length,
        take,
        sex: sex || "NONE",
        posts: posts
    };

    res.json(data);
};


const getCachedPosts = async (ids: number[], map: Map<number, Posts | null>, redisClient: RedisClient) => {
    const prefixIds = ids.map(id => CACHE_POST_PREFIX + id);
    const cachedPosts = await redisClient.MGET(prefixIds);

    

    for(const [index, post] of cachedPosts.entries()){
        if(post !== null) {
            map.set(ids[index], JSON.parse(post))
            await redisClient.expire(prefixIds[index], CACHE_POST_EXPIRE);
        } 
    }
}

const setPostCache = async (postMap: Map<number, Posts | null>, redisClient: RedisClient, prisma: PrismaClient) => {
    const cacheMissedIds = Array.from(postMap).filter(([key, value]) => value === null).map(([key]) => key);

    if(cacheMissedIds.length > 0){
        const posts = await getRandomPostsPublicService({ postIds: cacheMissedIds }, prisma);

        for(const post of posts) {
            await redisClient.setEx(CACHE_POST_PREFIX + post.id, CACHE_POST_EXPIRE, JSON.stringify(post));
        }
        posts.forEach(post => {
            postMap.set(post.id, post);
        });
    }
}