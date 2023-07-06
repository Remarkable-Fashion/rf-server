import type { Request, Response } from "express";
import { client } from "../../../db/elasticsearch";
import { getSearchRankService } from "../service/get-search-rank";
import { SEARCH_LOG_INDEX } from "../constants";

const SIZE = 10;
const FIELD = "query";

export const getSearchRank = async (req: Request<unknown, unknown, unknown, {search?: string}>, res: Response) => {

    const now = new Date();
    const thirtyDaysAgoISOString = getPastDateISOString(30, now);
    const nowISOString = now.toISOString().slice(0, -5);

    const dateRange = {
        gte: thirtyDaysAgoISOString,
        lte: nowISOString
    }

    const rv = await getSearchRankService({ query: FIELD, index: SEARCH_LOG_INDEX, date: dateRange, size: SIZE }, client);

    const data = {
        ranks: rv.body.aggregations.popular_keywords.buckets.map( ({key}: any) => key)
    }

    res.status(200).json(data);
};

function getPastDateISOString(days: number, now?: Date) {
    const currentDate = now || new Date(); // 현재 날짜 및 시간 가져오기
    const pastDate = new Date(currentDate); // 현재 날짜 및 시간을 복사하여 새로운 객체 생성
    pastDate.setDate(currentDate.getDate() - days); // 지정된 일 수 이전의 날짜로 설정
  
    const isoString = pastDate.toISOString().slice(0, -5); // ISO 문자열로 변환
    return isoString;
}
