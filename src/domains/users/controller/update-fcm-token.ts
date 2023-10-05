import { Request, Response } from "express";
import { UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { updateFcmTokenService } from "../service/update-fcm-token";

export const updateFcmToken = async (req: Request, res: Response) => {
    // if(req.id !== Number(req.params.id)){
    const userId = req.id;
    if (!userId) {
        throw new UnauthorizedError();
    }

    const fcmToken = req.body.token as string;

    await updateFcmTokenService(
        userId,
        fcmToken,
        Prisma
    );
    res.json({
        success: true,
        msg: "Success update FCM Token"
    });
};
