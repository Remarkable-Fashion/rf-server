import { Router } from "express";
import { createFavorite } from "../domains/posts/controller/create-favorite";
import { createPost } from "../domains/posts/controller/create-post";
import { createScrap } from "../domains/posts/controller/create-scrap";
import { deleteFavorite } from "../domains/posts/controller/delete-favorite";
import { deleteScrap } from "../domains/posts/controller/delete-scrap";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";
import { conf } from "../config";
import { upload } from "../middleware/upload";
import { UserWithRole } from "../@types/express";
import { getRandomPosts } from "../domains/posts/controller/get-random-posts";

const postRouter = Router();

postRouter.get("/test", (req, res) => {
    res.json({ msg: "post test" });
});

postRouter.post(
    "/upload-test",
    (req, res, next) => {
        req.user = {
            id: 10,
            name: "Asdf",
            email: "asdf",
            role: "User",
            type: "Kakao",
        } as unknown as UserWithRole;
        req.id = 10;
        next();
    },
    upload.fields([{ name: "test" }]),
    (req, res) => {
        const files = (req.files as { [fieldName: string]: Express.Multer.File[] }).test;
        const filesName = files.map((f) => `${conf().CLIENT_DOMAIN}/${f.filename}`);

        res.json({ msg: "post test", filesName, body: req.body.name });
    }
);

postRouter.get("/", authJWT, controllerHandler(getRandomPosts));

postRouter.post("/", authJWT, upload.fields([{ name: "images" }]), controllerHandler(createPost));
postRouter.post("/:id/favorite", authJWT, controllerHandler(createFavorite));
postRouter.delete("/:id/favorite/:favoriteId", authJWT, controllerHandler(deleteFavorite));

postRouter.post("/:id/scrap", authJWT, controllerHandler(createScrap));
postRouter.delete("/:id/scrap/:scrapId", authJWT, controllerHandler(deleteScrap));

export { postRouter };
