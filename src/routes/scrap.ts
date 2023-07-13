import { Router } from "express";
import { getScraps } from "../domains/scrap/controller/get-scraps";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";
import { getScrapsAll } from "../domains/scrap/controller/get-scraps-all";

const scrapRouter = Router();

scrapRouter.get("/", authJWT, controllerHandler(getScraps));
scrapRouter.get("/test", authJWT, controllerHandler(getScrapsAll));

export { scrapRouter };
