import type { Request, Response } from "express";
import typia from "typia";
import { postSex } from "../types";
import { BadReqError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getRandomPostsPublicService } from "../service/get-random-posts-public";
import { getRandomPostsElasticSearchSerivce } from "../service/get-random-posts-test";
import { client } from "../../../db/elasticsearch";
import { POSTS_INDEX } from "../../search/constants";

const DEFAULT_SIZE = 21;

type ReqQuery = {
    take?: string;
    sex?: string;
};

type ReqType = {
    sex?: typeof postSex[number];
};

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

    // const collectionName = createCollectionName(createYearMonthString(), POST_PRE_FIX);
    // const randomPosts = await getRandomPostsMongoService(mongo.Db, collectionName, {
    //     size: take,
    //     sex: sex
    // });

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

    const posts = await getRandomPostsPublicService({ postIds: ids }, Prisma);

    const data = {
        size: posts.length,
        take,
        sex: sex || "NONE",
        posts
    };

    res.json(data);
};
