import type { Request, Response } from "express";
import { BadReqError } from "../../../lib/http-error";
import { client } from "../../../db/elasticsearch";
import { getSearchPostsService } from "../service/get-search-posts";
import { createSearchService } from "../service/create-search-log";
import { POSTS_INDEX, SEARCH_LOG_INDEX } from "../constants";
import Prisma from "../../../db/prisma";
import { getRandomPostsService } from "../../posts/service/get-random-posts";

export const getSearchPosts = async (req: Request<unknown, unknown, unknown, {search?: string, take?: string}>, res: Response) => {

    const query = req.query.search;
    if(!query){
        throw new BadReqError("No 'Search' query string");
    }
    const take = validateSize(req.query.take);
    const posts = await getSearchPostsService({ query, size: take, index: POSTS_INDEX }, client);

    const organizedPosts = posts.body.hits.hits.map((post: any) => {
        return post._source;
    });

    //create search log
    await createSearchService({ query, index: SEARCH_LOG_INDEX, userId: req.id }, client);

    const ids = organizedPosts.map((post: any) => {
        return post.id;
    });

    const [_posts] = await getRandomPostsService({userId: req.id, postIds: ids}, Prisma);
    const mergedPosts = _posts.map( post => {
        const isFollow = post.user.followers.length > 0;
        const isFavoirte = post.favorites.length > 0;
        const isScrap = post.scraps.length > 0;

        return {
            isFavoirte,
            isFollow,
            isScrap,
            ...post

        }
    });

    const data = {
        size: _posts.length,
        search: query,
        take,
        posts: mergedPosts
    }

    res.status(200).json(data);
};

const validateSize = (size?: string) => {
    if(!size){
        throw new BadReqError("No 'size' query string");
    }

    const parsedSize = Number(size);
    if(Number.isNaN(parsedSize)){
        throw new BadReqError("'size' should be Number");
    }
    
    if(parsedSize <= 0 || parsedSize > 20){
        throw new BadReqError("'size' should be 0 to 20");
    }

    return parsedSize;
}