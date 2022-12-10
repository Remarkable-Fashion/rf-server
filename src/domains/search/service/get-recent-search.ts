import { RedisType } from "../../../db/redis";

export const getRecentSearch = ({ key, count }: { key: string; count: number }, redis: RedisType) => {
    return redis.zRange(key, 0, count - 1, { REV: true });
};
