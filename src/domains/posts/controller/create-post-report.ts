import type { Request, Response } from "express";
import TSON from "typia";
import Prisma from "../../../db/prisma";
import {  CreatePostBody } from "../service/create-post";
import {  UnauthorizedError } from "../../../lib/http-error";
import { validateBody } from "../../../lib/validate-body";
// import { createPostReportService } from "../service/create-post-report";

type Body = {
    postId: number
    message: string
}
export const createPostReport = async (req: Request<unknown, unknown, CreatePostBody>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError("Check your user");
    }
    const body = validateBody(TSON.createValidateEquals<Body>())(req.body);

    //@TODO report 테이블 생성.
    // await createPostReportService(body, Prisma);

    res.status(200).json({
        success: true,
        msg: "Success create post report"
    });
};
