import type { Request, Response } from "express";
import { mongo } from "../../../db/mongodb";
import { createYearMonthString } from "../../../lib/create-date";
import { getRandomPostsMongo as getRandomPostsMongoService } from "../service/get-random-posts";
import { POST_PRE_FIX, postSex } from "../types";
import { createCollectionName } from "../create-collection-name";
import typia from "typia"
import { BadReqError } from "../../../lib/http-error";

const DEFAULT_SIZE = 21;

type ReqQuery = {
    take?: string;
    sex?: string;
};

type ReqType = {
    sex?: typeof postSex[number]
}
export const getRandomPosts = async ( req: Request<unknown, unknown, unknown, ReqQuery>, res: Response) => {
    const { take, sex } = req.query
    const parsedSize = Number(take);
    // eslint-disable-next-line no-underscore-dangle
    const size = take && !Number.isNaN(parsedSize) && parsedSize < DEFAULT_SIZE ? parsedSize : DEFAULT_SIZE;

    const result = typia.validateEquals<ReqType>({sex: sex})

    if(!result.success){
        throw new BadReqError("Check your req.query.sex")
    }

    const _sex = result.data.sex;

    /**
     * @TODO 최근 6개월 총 21개
     * 최근 3개월 14개
     * 나머지 3개월 7개
     * 
     * @현재
     * 최근 달에서 21개 호출.
     * 
     * @TODO2 tpo, season, style 필터 넣기?
     */
    const collectionName = createCollectionName(createYearMonthString(), POST_PRE_FIX);
    const posts = await getRandomPostsMongoService(mongo.Db, collectionName, {
        size,
        sex: _sex
    });

    res.json(posts);
};
