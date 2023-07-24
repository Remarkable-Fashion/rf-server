import { Router } from "express";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { createRecommendClothes } from "../domains/clothes/controller/create-recommend-clothes";
import { getRecommendClothesByIdTop3 } from "../domains/clothes/controller/get-recommend-clothes-top3";
import { createFavoriteClothes } from "../domains/clothes/controller/create-favorite-clothes";
import { createScrapClothesById } from "../domains/clothes/controller/create-scrap-clothes";
import { uploadClothesImages } from "../domains/clothes/controller/upload-clothes-image";
import { getRecommendClothesById } from "../domains/clothes/controller/get-recommend-clothes";

const clothesRouter = Router();

clothesRouter.get("/:id/recommend/top", authJWT, controllerHandler(getRecommendClothesByIdTop3));
clothesRouter.get("/:id/recommend/", authJWT, controllerHandler(getRecommendClothesById));
clothesRouter.post("/:id/recommend/", authJWT, controllerHandler(createRecommendClothes));

clothesRouter.post("/:id/favorite", authJWT, controllerHandler(createFavoriteClothes));
clothesRouter.post("/:id/scrap", authJWT, controllerHandler(createScrapClothesById));

clothesRouter.post("/image", authJWT, upload({ prefix: "clothes" }).fields([{ name: "clothes" }]), controllerHandler(uploadClothesImages));
// clothesRouter.post("/image", authJWT, upload.fields([{name: "images" }]), controllerHandler(uploadClthesImages));

export { clothesRouter };
