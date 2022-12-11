import { Router } from "express";
import { getScraps } from "../domains/scrap/controller/get-scraps";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";

const scrapRouter = Router();

scrapRouter.get("/", authJWT, controllerHandler(getScraps));

export { scrapRouter };
