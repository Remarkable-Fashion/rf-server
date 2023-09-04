import { Request, Response } from "express";
import { BadReqError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getPostsByUserIdService } from "../service/get-posts-by-user-id";
import { redisClient } from "../../../db/redis";

const validateParamId = (id?: string) => {
    if (!id) {
        throw new BadReqError("Should be param 'id'");
    }
    const parsedId = Number(id);

    if (Number.isNaN(parsedId)) {
        throw new BadReqError("param 'id' should be Number");
    }

    return parsedId;
};

const validateQueryCursor = (cursor?: string) => {
    if (!cursor) {
        return undefined;
    }
    const parsedCursor = Number(cursor);
    if (Number.isNaN(parsedCursor)) {
        throw new BadReqError("cursor should be Number");
    }

    if (parsedCursor <= 0) {
        throw new BadReqError("cursor should be bigger than 0");
    }
    return parsedCursor;
};
const validateQueryTake = (take?: string) => {
    if (!take) {
        throw new BadReqError("query 'take' should be");
    }
    const parsedTake = Number(take);
    if (Number.isNaN(parsedTake)) {
        throw new BadReqError("query 'take' should be Number");
    }

    if (parsedTake <= 0) {
        throw new BadReqError("take should be bigger than 0");
    }
    return parsedTake;
};

export const getPostsByUserId = async (req: Request<{ id?: string }, unknown, unknown, { cursor?: string; take?: string }>, res: Response) => {
    const id = validateParamId(req.params.id);
    const cursor = validateQueryCursor(req.query.cursor);
    const take = validateQueryTake(req.query.take);

    const { posts, countOfPosts, lastOfPost } = await getPostsByUserIdService({ myId: req.id, userId: id, cursor, take }, Prisma, redisClient);
    const last = posts[posts.length - 1];
    if (posts.length <= 0) {
        const data = {
            nextCursor: null,
            hasNext: false,
            cursor: cursor ?? 0,
            take,
            totalCounts: countOfPosts,
            size: 0,
            posts: []
        };
        res.json(data);
        return;
    }
    const data = {
        nextCursor: last.id,
        hasNext: last.id > (lastOfPost?.id ?? 0),
        cursor: cursor ?? 0,
        take,
        totalCounts: countOfPosts,
        size: posts.length,
        posts
    };

    res.json(data);
};
