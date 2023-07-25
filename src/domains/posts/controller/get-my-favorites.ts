import type { Request, Response } from "express";
import Prisma from "../../../db/prisma";
import { BadReqError } from "../../../lib/http-error";
import { getMyFavoritesService } from "../service/get-my-favorites";

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

export const getMyFavorites = async (req: Request<unknown, unknown, unknown, { cursor?: string; take?: string }>, res: Response) => {
    const cursor = validateCursor(req.query.cursor);
    const take = validateTake(req.query.take);

    const [totalCountsOfFavorites, lastMyFavorite, posts] = await getMyFavoritesService(
        {
            userId: req.id,
            cursor,
            take
        },
        Prisma
    );
    if (posts.length <= 0) {
        const data = {
            nextCursor: null,
            hasNext: false,
            totalCounts: totalCountsOfFavorites,
            size: 0,
            take,
            cursor: cursor ?? 0,
            posts: []
        };
        res.json(data);
        return;
    }

    const mergedPosts = posts.map((post) => {
        const isFollow = post.post!.user.followers.length > 0;
        const isFavorite = post.post!.favorites.length > 0;

        return {
            isFavorite,
            isFollow,
            ...post
        };
    });

    const lastPostId = posts[posts.length - 1].id!;
    const data = {
        nextCursor: lastPostId,
        hasNext: lastPostId > (lastMyFavorite?.id ?? 0),
        totalCounts: totalCountsOfFavorites,
        size: posts.length,
        take,
        cursor: cursor ?? 0,
        posts: mergedPosts
    };

    res.status(200).json(data);
};
