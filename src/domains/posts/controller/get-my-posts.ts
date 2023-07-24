import type { Request, Response } from "express";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getMyPostsService } from "../service/get-my-posts";

const DEFAULT_TAKE = 21;

const validateCursor = (cursor?: string) => {
    const cursorT = cursor ? Number(cursor) : undefined;
    if (cursorT && cursorT < 0) {
        throw new BadReqError("cursor should be higher than 0");
    }

    return cursorT;
};

const validateTake = (take?: string) => {
    const takeT = take ? Number(take) : DEFAULT_TAKE;

    if (take && takeT < 0) {
        throw new BadReqError("take should be higher than 0");
    }

    return takeT;
};

export const getMyposts = async (req: Request<unknown, unknown, unknown, { cursor?: string; take?: string }>, res: Response) => {
    const id = req.id;
    if (!id) {
        throw new UnauthorizedError();
    }
    const cursor = validateCursor(req.query.cursor);
    const take = validateTake(req.query.take);

    const [totalCountsOfPosts, lastMyPost, posts] = await getMyPostsService({ userId: id, cursor, take }, Prisma);

    const countsOfposts = posts.length;

    const lastPostId = posts[posts.length - 1].id!;
    const data = {
        nextCursor: lastPostId,
        hasNext: lastPostId > (lastMyPost?.id ?? 0),
        totalCounts: totalCountsOfPosts,
        size: countsOfposts,
        take,
        cursor,
        posts
    };

    res.json(data);
};
