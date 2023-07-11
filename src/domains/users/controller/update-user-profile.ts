import { Request, Response } from "express";
import TSON from "typia";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { UpdateProfile, updateUserProfile as updateUserProfileService } from "../service/update-user-profile";
import { validateBody } from "../../../lib/validate-body";
import { conf } from "../../../config";

export const updateUserProfile = async (req: Request, res: Response) => {
    // if(req.id !== Number(req.params.id)){
    const userId = req.id;
    if (!userId) {
        throw new UnauthorizedError();
    }

    const file = req.files as { [fieldName: string]: Express.Multer.File[] };

    const avartarUrls = file.avartar && file.avartar.map((f) => `${conf().SERVER_DOMAIN}/${f.filename}`);

    console.log("avartarUrls :", avartarUrls);

    if (avartarUrls && avartarUrls.length !== 1) {
        throw new BadReqError("There must be one image");
    }

    const data = validateBody(TSON.createValidateEquals<UpdateProfile>())(req.body);

    const { user } = await updateUserProfileService(
        userId,
        {
            ...data,
            ...(avartarUrls && {
                avartar: avartarUrls[0]
            })
            // avartar: avartarUrls[0]
        },
        Prisma
    );
    res.json(user);
};
