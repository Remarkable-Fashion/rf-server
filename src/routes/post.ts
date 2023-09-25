import { Router } from "express";
import { createFavorite } from "../domains/posts/controller/create-favorite";
import { createPost } from "../domains/posts/controller/create-post";
import { createScrap } from "../domains/posts/controller/create-scrap";
import { deleteFavorite } from "../domains/posts/controller/delete-favorite";
import { deleteScrap } from "../domains/posts/controller/delete-scrap";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { apiLimiterFunc } from "../middleware/api-rate-limit";
import { getPostById } from "../domains/posts/controller/get-post-by-id";
import { getRandomPosts } from "../domains/posts/controller/get-random-posts";
import { getMyposts } from "../domains/posts/controller/get-my-posts";
import { getRandomPostsPublic } from "../domains/posts/controller/get-random-posts-public";
import { getMyFavorites } from "../domains/posts/controller/get-my-favorites";
import { deletePostById } from "../domains/posts/controller/delete-post-by-id";
import { getPostsByUserId } from "../domains/posts/controller/get-post-by-user-id";
import { uploadPostImage } from "../domains/posts/controller/upload-post-image";
import { updatePostStatus } from "../domains/posts/controller/update-post-status";
import { createPostReport } from "../domains/posts/controller/create-post-report";
import { updatePostById } from "../domains/posts/controller/update-post-by-id";
import { getMyFollowingPosts } from "../domains/posts/controller/get-my-following-posts";

const postRouter = Router();

postRouter.get("/", authJWT, controllerHandler(getRandomPosts));
// postRouter.get("/test-dms", authJWT, controllerHandler(getRandomPosts));
postRouter.get("/public", apiLimiterFunc({ time: 15, max: 3, postFix: "public" }), controllerHandler(getRandomPostsPublic));
postRouter.get("/followings", authJWT, controllerHandler(getMyFollowingPosts));

postRouter.patch("/:id", authJWT, controllerHandler(updatePostById));
postRouter.patch("/:id/status", authJWT, controllerHandler(updatePostStatus));

postRouter.get("/me", authJWT, controllerHandler(getMyposts));

postRouter.get("/user/:id", authJWT, controllerHandler(getPostsByUserId));

postRouter.get("/favorite", authJWT, controllerHandler(getMyFavorites));
postRouter.get("/:id", authJWT, controllerHandler(getPostById));
postRouter.delete("/:id", authJWT, controllerHandler(deletePostById));

postRouter.post("/image", authJWT, upload({ prefix: "post" }).fields([{ name: "posts" }]), controllerHandler(uploadPostImage));
postRouter.post("/", authJWT, controllerHandler(createPost));
postRouter.post("/report", authJWT, controllerHandler(createPostReport));

postRouter.post("/:id/favorite", authJWT, controllerHandler(createFavorite));
postRouter.delete("/:id/favorite", authJWT, controllerHandler(deleteFavorite));

postRouter.post("/:id/scrap", authJWT, controllerHandler(createScrap));
postRouter.delete("/:id/scrap", authJWT, controllerHandler(deleteScrap));

export { postRouter };
