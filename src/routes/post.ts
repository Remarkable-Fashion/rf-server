import { Router } from "express";
import { createFavorite } from "../domains/posts/controller/create-favorite";
import { createPost } from "../domains/posts/controller/create-post";
import { createScrap } from "../domains/posts/controller/create-scrap";
import { deleteFavorite } from "../domains/posts/controller/delete-favorite";
import { deleteScrap } from "../domains/posts/controller/delete-scrap";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";

const postRouter = Router();

postRouter.get("/test", (req, res) => {
    res.json({ msg: "post test" });
});

postRouter.post("/", authJWT, controllerHandler(createPost));
postRouter.post("/:id/favorite", authJWT, controllerHandler(createFavorite));
postRouter.delete("/:id/favorite/:favoriteId", authJWT, controllerHandler(deleteFavorite));

postRouter.post("/:id/scrap", authJWT, controllerHandler(createScrap));
postRouter.delete("/:id/scrap/:scrapId", authJWT, controllerHandler(deleteScrap));

export { postRouter };
