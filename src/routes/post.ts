import { Router } from "express";
import { createFavorite } from "../domains/posts/controller/create-favorite";
import { createPost } from "../domains/posts/controller/create-post";
import { createScrap } from "../domains/posts/controller/create-scrap";
import { deleteFavorite } from "../domains/posts/controller/delete-favorite";
import { deleteScrap } from "../domains/posts/controller/delete-scrap";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT, authTest } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { apiLimiterFunc } from "../middleware/api-rate-limit";
import { getPostById } from "../domains/posts/controller/get-post-by-id";
import { getRandomPosts } from "../domains/posts/controller/get-random-posts";
import { getMyposts } from "../domains/posts/controller/get-my-posts";
import { getRandomPostsPublic } from "../domains/posts/controller/get-random-posts-public";
import { getMyFavorites } from "../domains/posts/controller/get-my-favorites";
import { deletePostById } from "../domains/posts/controller/delete-post-by-id";
import { getPostsByUserId } from "../domains/posts/controller/get-post-by-user-id";

const postRouter = Router();

// postRouter.get("/:id", authJWT, controllerHandler(getPostById));

postRouter.get("/", authJWT, controllerHandler(getRandomPosts));
// postRouter.get("/test", authJWT, controllerHandler(getRandomPostsTest));
postRouter.get("/public", apiLimiterFunc({ time: 15, max: 3, postFix: "public" }), controllerHandler(getRandomPostsPublic));
// postRouter.get("/", authJWT, controllerHandler(getRandomPosts));
// postRouter.get("/public", apiLimiterFunc({ time: 15, max: 3, postFix: "public" }), controllerHandler(getRandomPosts));

postRouter.get("/me", authJWT, controllerHandler(getMyposts));

postRouter.get("/user/:id", authJWT, controllerHandler(getPostsByUserId));
// postRouter.get("/me/test", authTest(5), controllerHandler(getMyposts));
// postRouter.get("/search", authJWT, controllerHandler(getTestSearchPosts));

postRouter.get("/favorite", authJWT, controllerHandler(getMyFavorites));
postRouter.get("/:id", authJWT, controllerHandler(getPostById));
postRouter.delete("/:id", authJWT, controllerHandler(deletePostById));
// postRouter.get("/test/:id", authTest(), controllerHandler(getPostById));

postRouter.post("/", authJWT, upload.fields([{ name: "images" }]), controllerHandler(createPost));

postRouter.post("/:id/favorite", authJWT, controllerHandler(createFavorite));
postRouter.delete("/:id/favorite", authJWT, controllerHandler(deleteFavorite));

postRouter.post("/:id/scrap", authJWT, controllerHandler(createScrap));
postRouter.delete("/:id/scrap", authJWT, controllerHandler(deleteScrap));

export { postRouter };
