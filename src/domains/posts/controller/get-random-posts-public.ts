import type { Request, Response } from "express";
import { mongo } from "../../../db/mongodb";
import { createYearMonthString } from "../../../lib/create-date";
import { getRandomPostsMongo as getRandomPostsMongoService } from "../service/get-random-posts-mongo";
import { POST_PRE_FIX, postSex } from "../types";
import { createCollectionName } from "../create-collection-name";
import typia from "typia"
import { BadReqError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getRandomPostsPublicService } from "../service/get-random-posts-public";
import { getOneMonthAgo } from "../../../lib/get-one-month-ago";

const DEFAULT_SIZE = 21;

type ReqQuery = {
    take?: string;
    sex?: string;
};

type ReqType = {
    sex?: typeof postSex[number]
}
export const getRandomPostsPublic = async ( req: Request<unknown, unknown, unknown, ReqQuery>, res: Response) => {
    const { take, sex } = req.query
    const parsedSize = Number(take);
    // eslint-disable-next-line no-underscore-dangle
    const size = take && !Number.isNaN(parsedSize) && parsedSize < DEFAULT_SIZE ? parsedSize : DEFAULT_SIZE;

    const result = typia.validateEquals<ReqType>({sex: sex})

    if(!result.success){
        throw new BadReqError("Check your req.query.sex")
    }

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
        sex: result.data.sex
    });

    const [_posts] = await getRandomPostsPublicService({ postIds: posts.map(post => post.postId)}, Prisma);

    // 기본 사이즈보다 가져온 게시글의 수가 적은 경우
    // 이전 달에서 가져옴.
    const _size = DEFAULT_SIZE - _posts.length;
    if(_size > 0){
        // const size = DEFAULT_SIZE - _posts.length;

        const getOneMonthAgoCollectionName = createCollectionName(createYearMonthString(getOneMonthAgo()), POST_PRE_FIX);
        const posts = await getRandomPostsMongoService(mongo.Db, getOneMonthAgoCollectionName, {
            size: _size,
            sex: result.data.sex
        });

        const [__posts] = await getRandomPostsPublicService({ postIds: posts.map(post => post.postId)}, Prisma);

        _posts.push(...__posts);
    }

    const mergedPosts = _posts.map( post => {
        const isFollow = false;
        const isFavoirte = false;
        const isScrap = false;

        return {
            isFavoirte,
            isFollow,
            isScrap,
            ...post

        }
    })

    res.json(mergedPosts);
};
