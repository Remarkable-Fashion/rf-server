import type { Request, Response } from "express";
import { mongo } from "../../../db/mongodb";
import { createYearMonthString } from "../../../lib/create-date";
import { getRandomPostsMongo as getRandomPostsMongoService } from "../service/get-random-posts-mongo";
import { POST_PRE_FIX, postSex } from "../types";
import { createCollectionName } from "../create-collection-name";
import typia from "typia"
import { BadReqError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getRandomPostsService } from "../service/get-random-posts";
import { getOneMonthAgo } from "../../../lib/get-one-month-ago";

const DEFAULT_SIZE = 21;

type ReqQuery = {
    take?: string;
    sex?: string;
};

type ReqType = {
    sex?: typeof postSex[number]
}
export const getRandomPosts = async ( req: Request<unknown, unknown, unknown, ReqQuery>, res: Response) => {
    const _take = req.query.take;
    // const sex = req.query.sex;

    const parsedTake = Number(_take);
    // eslint-disable-next-line no-underscore-dangle
    const take = _take && !Number.isNaN(parsedTake) 
        && parsedTake < DEFAULT_SIZE ? parsedTake : DEFAULT_SIZE;

    const result = typia.validateEquals<ReqType>({sex: req.query.sex})

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
<<<<<<< HEAD
    const posts = await getRandomPostsMongoService(mongo.Db, collectionName, {
        size,
        sex: result.data.sex
    });

    const [_posts] = await getRandomPostsService({userId: req.id, postIds: posts.map(post => post.postId)}, Prisma);

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

        const [__posts] = await getRandomPostsService({userId: req.id, postIds: posts.map(post => post.postId)}, Prisma);

        _posts.push(...__posts);
    }

    const mergedPosts = _posts.map( post => {
=======
    const randomPosts = await getRandomPostsMongoService(mongo.Db, collectionName, {
        size: take,
        sex: result.data.sex
    });

    const [posts] = await getRandomPostsService({userId: req.id, postIds: randomPosts.map(post => post.postId)}, Prisma);

    // 기본 사이즈보다 가져온 게시글의 수가 적은 경우
    // 이전 달에서 가져옴.
    // @TODO 근데 적을 일이 없음.
    // const countsOfPosts = DEFAULT_SIZE - _posts.length;
    // if(countsOfPosts > 0){
    //     // const size = DEFAULT_SIZE - _posts.length;

    //     const getOneMonthAgoCollectionName = createCollectionName(createYearMonthString(getOneMonthAgo()), POST_PRE_FIX);
    //     const posts = await getRandomPostsMongoService(mongo.Db, getOneMonthAgoCollectionName, {
    //         size: countsOfPosts,
    //         sex: result.data.sex
    //     });

    //     const [__posts] = await getRandomPostsService({userId: req.id, postIds: posts.map(post => post.postId)}, Prisma);

    //     _posts.push(...__posts);
    // }

    const mergedPosts = posts.map( post => {
>>>>>>> 90fca2f (Feature/get post by (#23))
        const isFollow = post.user.followers.length > 0;
        const isFavoirte = post.favorites.length > 0;
        const isScrap = post.scraps.length > 0;

        return {
            isFavoirte,
            isFollow,
            isScrap,
            ...post

        }
<<<<<<< HEAD
    })

    res.json(mergedPosts);
=======
    });

    const data = {
        size: posts.length,
        // totalCounts: posts.length,
        take,
        sex: result.data.sex || "NONE",
        posts: mergedPosts
    }

    res.json(data);
>>>>>>> 90fca2f (Feature/get post by (#23))
};
