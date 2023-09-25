import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { getMyFollowingPostsService } from "../service/get-my-following-posts";
import { BadReqError } from "../../../lib/http-error";

const DEFAULT_TAKE = 21;

function isValidDate(dateString: string) {
    // Date 객체 생성
    const date = new Date(dateString);
    
    // 생성된 Date 객체가 유효한지 확인
    return !isNaN(date.getTime());
}

const validateCursor = (cursor?: string) => {
    if(!cursor){
        return;
    }

    if(!isValidDate(cursor)){
        throw new BadReqError("cursor should be ISO 8601 format");
    }

    return new Date(cursor);
};

const validateTake = (take?: string) => {
    const takeT = take ? Number(take) : DEFAULT_TAKE;

    if (take && takeT < 0) {
        throw new BadReqError("take should be higher than 0");
    }

    return takeT;
};

export const getMyFollowingPosts = async (req: Request<unknown, unknown, unknown, { cursor?: string; take?: string }>, res: Response) => {
    const cursor = validateCursor(req.query.cursor);
    const take = validateTake(req.query.take);

    const {posts, lastMyFollowingPost} = await getMyFollowingPostsService(
        {
            userId: req.id,
            lastCreatedAt: cursor,
            take
        },
        Prisma
    );

    if(posts.length <=0) {

        const data = {
            nextCursor: null,
            hasNext: false,
            cursor,
            take,
            posts: []
        }
        res.json(data);
        return;
    }

    const hasNext = lastMyFollowingPost?.id !== posts[posts.length - 1].id;

    const data = {
        nextCusror: posts[posts.length - 1].createdAt,
        size: posts.length,
        hasNext,
        cursor,
        take,
        posts,
        // lastMyFollowingPost
    };

    res.status(200).json(data);
};
