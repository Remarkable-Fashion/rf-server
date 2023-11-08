import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { Role, SocialType } from "@prisma/client";
import { BadReqError } from "../../../lib/http-error";
import { getUserByEmail } from "../../users/service/get-user-by-email";
import { createUser } from "../../users/service/create-user";
import prisma from "../../../db/prisma";
import { createLogService } from "../../logs/service/create-log";
import { createFcmTokenService } from "../../users/service/create-fcm-token";

const url = "https://kapi.kakao.com/v2/user/me";
const USER_CREATED = "USER_CREATED";

const getKakaoAccount = async (accessToken: string) => {
    const result = await axios({
        method: "POST",
        url,
        data: {
            // eslint-disable-next-line camelcase
            property_keys: ["kakao_account.profile", "kakao_account.email"]
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return result.data;
};

export const loginKakao = async (req: Request, res: Response, next: NextFunction) => {
    console.log("### IN loginKakao Modile APP");
    const accessToken = req.query.accessToken as string;
    const fcmToken = req.query.fcmToken as string;

    if (!accessToken) {
        throw new BadReqError("No accessToken");
    }

    const result = await getKakaoAccount(accessToken);

    const socialId = String(result.id);
    const email = result.kakao_account.email as string;

    if (!socialId || !email) {
        throw new BadReqError("Check your Kakao access token");
    }

    let user = await getUserByEmail({ email, type: SocialType.Kakao, socialId }, prisma);
    console.log("user :", user);
    if (!user) {
        if (!fcmToken) {
            throw new BadReqError("No fcmToken");
        }

        const createdUser = await createUser(
            { user: { email }, meta: { role: Role.User }, social: { type: SocialType.Kakao, socialId }, fcmToken },
            prisma
        );

        user = {
            ...createdUser,
            deletedAt: null
        };
        await createLogService({ usersId: user.id, message: USER_CREATED }, prisma);
    }

    /**
     * @info 기존에 탈퇴한 유저라면?
     */

    if (user.deletedAt) {
        throw new BadReqError("기존에 탈퇴한 회원입니다. 운영자에게 문의주세요.");
    }

    if (!user.token) {
        if (!fcmToken) {
            throw new BadReqError("No fcmToken");
        }
        await createFcmTokenService({ token: fcmToken, userId: user.id }, prisma);
    }

    // const user = await findUserOrCreate({ user: { email }, meta: { role: Role.User }, social: { type: SocialType.Kakao, socialId } }, prisma);

    const data = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.meta!.role,
        type: SocialType.Kakao,
        profile: user.profile!,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        scrapCount: 0,
        accessToken,
        token: {
            kakao: accessToken
        }
    };

    req.user = data;
    req.token = req.token || {};
    req.token.kakao = accessToken;

    req.id = data.id;

    next();
};
