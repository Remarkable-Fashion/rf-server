import type { Request, Response } from "express";
import TSON from "typia";
import Prisma from "../../../db/prisma";
import { CreatePost, createPost as createPostService, CreatePostBody } from "../service/create-post";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import { conf } from "../../../config";
import { validateBody } from "../../../lib/validate-body";
import { mongo } from "../../../db/mongodb";
import { createPostMongo as createPostMongoService } from "../service/create-post-mongo";
import { createYearMonthString } from "../../../lib/create-date";
import { POST_PRE_FIX } from "../types";
import { createCollectionName } from "../create-collection-name";


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

    const sex = req.body.sex;
    // const sex = req.body.sex || req.user.profile.sex;
    if (!sex) {
        throw new BadReqError("Check your user profile field, sex");
    }

    const data: CreatePost = { userId: req.id, ...body, imgUrls, sex };
    const post = await createPostService(data, Prisma);
    const { id: postId } = post;
    // const { id: postId, ..._post } = post;

    /**
     * @TODO collection 이름을 동적 생성.
     * 배치잡을 통해 6개월이 지난 collection 일괄 삭제.
     * @TODO2 get-random-posts controller도 같이 수정.
     */
    const collectionName = createCollectionName(createYearMonthString(), POST_PRE_FIX);
    await createPostMongoService({ postId: postId, sex: post.sex }, mongo.Db, collectionName);
    // await createPostMongoService({ postId: postId, ..._post }, mongo.Db, collectionName);

    res.status(200).json(post);
};
