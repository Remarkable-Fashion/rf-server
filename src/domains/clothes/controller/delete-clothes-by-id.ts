import { Request, Response } from "express";
import { ClothesCategory } from "@prisma/client";
import typia from "typia";
import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
import Prisma from "../../../db/prisma";
import { getRecommendClothesByIdTop3Service } from "../service/get-recommend-clothes-top3";
import { validateBody } from "../../../lib/validate-body";
import { deleteClothesByIdService } from "../service/delete-clothes-by-id";

const validateParamClothesId = (id?: string) => {
    if (!id) {
        throw new BadReqError("Check Params id");
    }

    const parsedId = Number(id);
    if (Number.isNaN(parsedId)) {
        throw new BadReqError("Params Shoud be Number");
    }

    return parsedId;
};

const validateQueryCategory = (category?: string) => {
    if (category === "All" || !category) {
        return undefined;
        // throw new BadReqError("Query string 'category' shoul be");
    }

    return validateBody(typia.createValidateEquals<ClothesCategory>())(category);
};


export const deleteClothesById = async (req: Request<{ id?: string }, unknown, unknown, { category?: string }>, res: Response) => {
    if (!req.id) {
        throw new UnauthorizedError();
    }

    const clothesId = validateParamClothesId(req.params.id);
    // const category = validateQueryCategory(req.query.category);

    /**
     * @TODO 엘라스틱 반영, 
     */
    await deleteClothesByIdService(clothesId, Prisma);

    // const data = {
    //     size: recommendClothes.length,
    //     category: category || "All",
    //     clothes: recommendClothes
    // };

    res.json({
        success: true,
        msg: "Success delete Clothes"
    });
};
