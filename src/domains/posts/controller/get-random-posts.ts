import type { Request, Response } from "express";
import typia from "typia";
import { postSex } from "../types";
import { BadReqError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getPostsByIdsService } from "../service/get-random-posts";
import { getRandomPostsElasticSearchSerivce } from "../service/get-random-posts-elasticsearch";
import { client } from "../../../db/elasticsearch";
import { POSTS_INDEX } from "../../search/constants";

const DEFAULT_SIZE = 21;

type ReqQuery = {
    take?: string;
    sex?: string;
    order?: string;
    height?: string;
    weight?: string;
};

type ReqType = {
    sex?: typeof postSex[number] | "All";
};

const validateQueryTake = (take?: string) => {
    if (!take) {
        throw new BadReqError("No 'take'");
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

const validateOrder = (order?: string ) => {
    if (!order){
        return;
    }
    if(order !== "best" && order !== "recent"){
        throw new BadReqError("order must be best or recent");
    }

    return order;
};

const validateHeight = (height?: string) => {

    if(!height) {
        return;
    }
    const result = Number(height);

    if(Number.isNaN(result)){
        throw new BadReqError("height must be number");
    }

    return [result - 5, result + 5];
};

const validateWeight = (weight?: string) => {

    if(!weight) {
        return;
    }
    const result = Number(weight);

    if(Number.isNaN(result)){
        throw new BadReqError("weight must be number");
    }

    return [result - 5, result + 5];
};


export const getRandomPosts = async (req: Request<unknown, unknown, unknown, ReqQuery>, res: Response) => {
    const take = validateQueryTake(req.query.take);
    const sex = validateQuerySex(req.query.sex);
    const order = validateOrder(req.query.order);
    const heights = validateHeight(req.query.height);
    const weights = validateWeight(req.query.weight);

    const now = new Date();
    const thirtyDaysAgoISOString = getPastDateISOString(30 * 6, now);
    const nowISOString = now.toISOString().slice(0, -5);

    const dateRange = {
        gte: thirtyDaysAgoISOString,
        lte: nowISOString
    };

    const elkPosts = await getRandomPostsElasticSearchSerivce({ index: POSTS_INDEX, size: take, sex, date: dateRange, order, heights, weights }, client);

    const ids = elkPosts.body.hits.hits.map(({ _source: { id } }: any) => {
        return id;
    }) as number[];

    if (ids.length <= 0) {
        const data = {
            size: 0,
            // totalCounts: posts.length,
            take,
            sex: sex || "ALL",
            posts: []
        };
        res.json(data);
        return;
    }

    const posts = await getPostsByIdsService({ userId: req.id, postIds: ids, order }, Prisma);

    const data = {
        size: posts.length,
        take,
        sex: sex || "ALL",
        new_posts: elkPosts.body.hits.hits.map((e: any) => e._source),
        posts: posts
    };

    res.json(data);
};


