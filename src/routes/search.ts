import { Router } from "express";
import { controllerHandler } from "../lib/controller-handler";
// import { createSearch } from "../domains/search/controller/create-search-log";
import { getSearchRank } from "../domains/search/controller/get-search-rank";
import { getSearchPosts } from "../domains/search/controller/get-search-posts";
import { authJWT } from "../middleware/auth";
import { getRecentSearchByUserId } from "../domains/search/controller/get-recent-search-by-user-id";
import { getSearchClothes } from "../domains/search/controller/get-search-clothes";
import { getIndexList } from "../domains/search/controller/get-index-list";

const searchRouter = Router();

searchRouter.get("/recent", authJWT, controllerHandler(getRecentSearchByUserId));
searchRouter.get("/post", authJWT, controllerHandler(getSearchPosts));
searchRouter.get("/clothes", authJWT, controllerHandler(getSearchClothes));
searchRouter.get("/rank", controllerHandler(getSearchRank));

searchRouter.get("/index", controllerHandler(getIndexList));

export { searchRouter };
