import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { getMyFavoritesService } from "../service/get-my-favorites";

const DEFAULT_TAKE = 21;

export const getMyFavorites = async (req: Request<unknown, unknown, unknown, {cursorId?: string, take?: string}>, res: Response) => {

    const cursor = validateCursor(req.query.cursorId);
    const take = validateTake(req.query.take);

    const [totalCountsOfFavorites, lastMyFavorite, posts] = await getMyFavoritesService({
        userId: req.id,
        cursor,
        take
    }, Prisma);

    const mergedPosts = posts.map( post => {
        const isFollow = post.post.user.followers.length > 0;
        const isFavoirte = post.post.favorites.length > 0;

        return {
            isFavoirte,
            isFollow,
            ...post
        }
    });

    const data = {
        nextCursorId: posts.at(-1)?.id,
        hasNext: posts.at(-1)?.id! > lastMyFavorite?.id!,
        totalCounts: totalCountsOfFavorites,
        size: posts.length,
        take,
        cursorId: cursor ?? 0,
        posts: mergedPosts
    }

    res.status(200).json(data);
};

const validateCursor = (cursor?: string) => {

    const _cursor = cursor ? Number(cursor) : undefined;
    if(_cursor && _cursor < 0){
        throw new BadReqError("cursor should be higher than 0")
    }

    return _cursor;
}


const validateTake = (take?: string) => {

    let _take = take ? Number(take) : DEFAULT_TAKE;

    if(take && _take < 0){
        throw new BadReqError("take should be higher than 0")
    }

    return _take;
}