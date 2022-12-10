import { RedisType } from "../../../db/redis";

export const createSearch = async (
    { data, count, key }: { data: { score: number; value: string }; count: number; key: string },
    redis: RedisType
) => {
    await redis.zAdd(key, data);
    await redis.zRemRangeByRank(key, -(count + 1), -(count + 1));
};
