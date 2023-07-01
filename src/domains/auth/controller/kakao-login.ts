import { NextFunction, Request, Response } from "express";
import { BadReqError } from "../../../lib/http-error";
import axios from "axios";
import { getUserByEmail } from "../../users/service/get-user-by-email";
import { Role, SocialType } from "@prisma/client";
import { createUser } from "../../users/service/create-user";
import prisma from "../../../db/prisma";

const url = "https://kapi.kakao.com/v2/user/me";

const getKakaoAccount = async (accessToken: string) => {

    const result = await axios({
        method: "POST",
        url,
        data: {
            property_keys: ["kakao_account.profile", "kakao_account.email"]
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return result.data;
}

export const loginKakao = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.query.accessToken as string;

        if (!accessToken) {
            throw new BadReqError("No accessToken");
        }
        
        const result = await getKakaoAccount(accessToken);

        const socialId = String(result.id);
        const email = result.kakao_account.email as string;
        
        if(!socialId || !email){
            throw new BadReqError("Check your Kakao access token");
        }

        let user = await getUserByEmail({ email, type: SocialType.Kakao, socialId }, prisma);

        if (!user) {
            user = await createUser({ user: { email }, meta: { role: Role.User }, social: { type: SocialType.Kakao, socialId } }, prisma);
        }

        const data = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.meta!.role,
            type: SocialType.Kakao,
            profile: user.profile!,
            accessToken
        };

        req.user = data;
        req.id = data.id;

        next();
}