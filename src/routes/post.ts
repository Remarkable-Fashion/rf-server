import { Router } from "express";
import { createPost } from "../domains/posts/controller/create-post";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";

const postRouter = Router();

postRouter.get("/test", (req, res) => {
    res.json({ msg: "post test" });
});

postRouter.post("/", authJWT, controllerHandler(createPost));

export { postRouter };
