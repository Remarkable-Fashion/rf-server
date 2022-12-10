import { Router } from "express";
import { createSearch } from "../domains/search/controller/create-search";
import { getRecentSearch } from "../domains/search/controller/get-recent-search";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";

const searchRouter = Router();

searchRouter.get("/", authJWT, controllerHandler(getRecentSearch));
searchRouter.post("/", authJWT, controllerHandler(createSearch));

export { searchRouter };
