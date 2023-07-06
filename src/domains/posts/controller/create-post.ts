import type { Request, Response } from "express";
import TSON from "typia";
import Prisma from "../../../db/prisma";
import { CreatePost, createPost as createPostService, CreatePostBody } from "../service/create-post";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import { conf } from "../../../config";
import { validateBody } from "../../../lib/validate-body";
import { createPostElasticSearchService } from "../service/create-post-elasticsearch";
import { client } from "../../../db/elasticsearch";

const index = "posts";
export const createPost = async (req: Request<unknown, unknown, CreatePostBody>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError("Check your user");
    }

    const body = validateBody(TSON.createValidateEquals<CreatePostBody>())(req.body);

    // if (!(req.body.imgUrls.length > 0)) {
    //     throw new BadReqError("imgUrls required");
    // }

    // @Check this issue : https://stackoverflow.com/questions/57631753/how-to-properly-handle-req-files-in-node-post-request-using-multer-and-typescrip#answer-70799312
    // const files = (req.files as { [fieldName: string]: Express.Multer.File[]}).images
    const imgUrls = (req.files as { [fieldName: string]: Express.Multer.File[] }).images.map((f) => conf().SERVER_DOMAIN + "/" + f.filename);

    if (!imgUrls || imgUrls.length < 1) {
        throw new BadReqError("There must be at least one image");
    }

    const sex = body.sex;
    // const sex = req.body.sex || req.user.profile.sex;
    if (!sex) {
        throw new BadReqError("Check your user profile field, sex");
    }

    const data: CreatePost = { userId: req.id, ...body, imgUrls, sex };
    const post = await createPostService(data, Prisma);

    /**
     * @TODO 
     * 기존 몽고디비에 저장해서 random search를 구현했지만
     * elasticsearch에 저장해서 검색엔진과 랜덤서치 둘을 사용하자.
     * 인덱스 저장할 때 _id는 sql의 id값 그대로 넣자.
     * noSql의 장점을 살리기 위해 하나의 도큐먼트로 다 때려박아야할 듯
     * 중첩된 객체에서도 인덱스 생성을 통해 검색엔진 구현이 되는듯.
     */
    // const collectionName = createCollectionName(createYearMonthString(), POST_PRE_FIX);
    // await createPostMongoService({ postId: postId, sex: post.sex }, mongo.Db, collectionName);

    
    await createPostElasticSearchService({ index, id: String(post.id), data: post}, client);
    // await createPostMongoService({ postId: postId, ..._post }, mongo.Db, collectionName);

    res.status(200).json(post);
};
