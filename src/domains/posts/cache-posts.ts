import { PrismaClient } from "@prisma/client";
// import { type RedisClient } from "../../db/redis";
import * as redis from "redis";
import { CACHE_POST_PREFIX, CACHE_POST_EXPIRE } from "./const";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type ElementOfArray<T> = T extends Array<infer U> ? U : never;
type Test = (...args: any) => Promise<any[]>;
type PostArrayElement<T extends Test> = ElementOfArray<UnwrapPromise<ReturnType<T>>>;

export class CachePosts<T extends Test> {
    private postMap: Map<number, PostArrayElement<T> | null>;

    private _cacheMissedIds: number[] = [];

    constructor(private readonly ids: number[], private readonly redisClient: redis.RedisClientType) {
        this.postMap = new Map<number, PostArrayElement<T> | null>();

        this.setPostMap();
    }

    private setPostMap() {
        this.ids.forEach((id) => {
            this.postMap.set(id, null);
        });
    }

    async init() {
        await this.setCachedPosts();
        this.setMissedCache();
    }

    private async setCachedPosts() {
        const prefixIds = this.ids.map((id) => CACHE_POST_PREFIX + id);
        const cachedPosts = await this.redisClient.MGET(prefixIds);

        for (const [index, post] of cachedPosts.entries()) {
            if (post !== null) {
                this.postMap.set(this.ids[index], JSON.parse(post));
                await this.redisClient.expire(prefixIds[index], CACHE_POST_EXPIRE);
            }
        }
    }

    private setMissedCache() {
        // eslint-disable-next-line no-underscore-dangle
        this._cacheMissedIds = Array.from(this.postMap)
            .filter(([_, value]) => value === null)
            .map(([key]) => key);
    }

    async setCache(cb: T, Prisma: PrismaClient) {
        // eslint-disable-next-line no-underscore-dangle
        if (this._cacheMissedIds.length <= 0) {
            return;
        }
        // eslint-disable-next-line no-underscore-dangle
        const posts = await cb({ postIds: this._cacheMissedIds }, Prisma);

        for (const post of posts) {
            await this.redisClient.setEx(CACHE_POST_PREFIX + post.id, CACHE_POST_EXPIRE, JSON.stringify(post));
            this.postMap.set(post.id, post);
        }
    }

    getPosts() {
        return Array.from(this.postMap.values());
    }
}
