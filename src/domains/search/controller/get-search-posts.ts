import type { Request, Response } from "express";
import { BadReqError } from "../../../lib/http-error";
import { client } from "../../../db/elasticsearch";
import { getSearchPostsService } from "../service/get-search-posts";
import { createSearchLogService } from "../service/create-search-log";
import { POSTS_INDEX, SEARCH_LOG_INDEX } from "../constants";
import Prisma from "../../../db/prisma";
import { getRandomPostsService } from "../../posts/service/get-random-posts";

export const getSearchPosts = async (req: Request<unknown, unknown, unknown, { search?: string; take?: string }>, res: Response) => {
    const query = req.query.search;
    if (!query) {
        throw new BadReqError("No 'Search' query string");
    }
    const take = validateTake(req.query.take);
    const posts = await getSearchPostsService({ query, size: take, index: POSTS_INDEX }, client);

    await createSearchLogService({ query, index: SEARCH_LOG_INDEX, userId: req.id }, client);

    const ids = posts.map((post: any) => {
        return post.id;
    });

    const _posts = await getRandomPostsService({ userId: req.id, postIds: ids }, Prisma);

    const data = {
        size: _posts.length,
        search: query,
        take,
        posts: _posts
    };

    res.status(200).json(data);
};

const validateTake = (take?: string) => {
    if (!take) {
        throw new BadReqError("No 'take' query string");
    }

    const parsedTake = Number(take);
    if (Number.isNaN(parsedTake)) {
        throw new BadReqError("'take' should be Number");
    }

    if (parsedTake <= 0 || parsedTake > 20) {
        throw new BadReqError("'take' should be 0 to 20");
    }

    return parsedTake;
};
