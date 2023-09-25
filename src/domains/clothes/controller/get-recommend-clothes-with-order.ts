// import { Request, Response } from "express";
// import { ClothesCategory } from "@prisma/client";
// import typia from "typia";
// import { BadReqError, UnauthorizedError } from "../../../lib/http-error";
// import Prisma from "../../../db/prisma";
// import { getRecommendClothesByIdTop3Service } from "../service/get-recommend-clothes-top3";
// import { validateBody } from "../../../lib/validate-body";
// import { getRecommendClothesByIdWithOrderService } from "../service/get-recommend-clothes-with-order";
// import { getRecommendClothesByIdService } from "../service/get-recommend-clothes";

// const validateParamClothesId = (id?: string) => {
//     if (!id) {
//         throw new BadReqError("Check Params id");
//     }

//     const parsedId = Number(id);
//     if (Number.isNaN(parsedId)) {
//         throw new BadReqError("Params Shoud be Number");
//     }

//     return parsedId;
// };

// const validateQueryCategory = (category?: string) => {
//     if (category === "All" || !category) {
//         return undefined;
//         // throw new BadReqError("Query string 'category' shoul be");
//     }

//     return validateBody(typia.createValidateEquals<ClothesCategory>())(category);
// };

// /**
//  * @info 이 의상은 어때
//  * Top 3
//  */
// export const getRecommendClothesByIdWithOrder = async (req: Request<{ id?: string }, unknown, unknown, { category?: string, order?: string }>, res: Response) => {
//     if (!req.id) {
//         throw new UnauthorizedError();
//     }

//     const clothesId = validateParamClothesId(req.params.id);
//     const category = validateQueryCategory(req.query.category);

//     const order = req.query.order;

//     if(order === "best"){
//         const recommendClothes = await getRecommendClothesByIdTop3Service({ id: clothesId, userId: req.id, category }, Prisma);
//     }
//     if(order === "recent"){
//         const {
//             countOfRecommendClothes,
//             clothes: recommendClothes,
//             lastRecommendAllClothes
//         } = await getRecommendClothesByIdService({ id: clothesId, cursor, take, userId: req.id, category }, Prisma);
//     }

    

//     const data = {
//         size: recommendClothes.length,
//         category: category || "All",
//         clothes: recommendClothes
//     };

//     res.json(data);
// };
