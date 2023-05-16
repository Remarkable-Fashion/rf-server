import { Router } from "express";
import { createFavorite } from "../domains/posts/controller/create-favorite";
import { createPost } from "../domains/posts/controller/create-post";
import { createScrap } from "../domains/posts/controller/create-scrap";
import { deleteFavorite } from "../domains/posts/controller/delete-favorite";
import { deleteScrap } from "../domains/posts/controller/delete-scrap";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT, authTest } from "../middleware/auth";
import { conf } from "../config";
import { upload } from "../middleware/upload";
import { getRandomPosts } from "../domains/posts/controller/get-random-posts";
import { BadReqError } from "../lib/http-error";
import { CreatePost } from "../domains/posts/service/create-post";
import Prisma from "../db/prisma";
import { mongo } from "../db/mongodb";
import { createCollectionName } from "../domains/posts/create-collection-name";
import { createYearMonthString } from "../lib/create-date";
import { POST_PRE_FIX } from "../domains/posts/types";
import { createPost as createPostService } from "../domains/posts/service/create-post";
import { createPostMongo as createPostMongoService } from "../domains/posts/service/create-post-mongo";
import { apiLimiterFunc } from "../middleware/api-rate-limit";

const postRouter = Router();

postRouter.get("/test", (req, res) => {
    res.json({ msg: "post test" });
});

postRouter.get("/", authJWT, controllerHandler(getRandomPosts));
postRouter.get("/public", apiLimiterFunc({ time: 15, max: 1 }), controllerHandler(getRandomPosts));

/**
 * 글로벌 api rate limit 카운트와 분리가 안되어 있음.
 * 글로벌 +1 / `/public` +1 총 2개씩 카운트됨. => 중복 카운트는 해결
 * 
 * redis 스토어에 같은 키 이름으로 카운트되지 않게 분리. => keyGen으로 중복 카운트와 같이 해결
 */
postRouter.get("/public", apiLimiterFunc({ time: 15, max: 3, postFix: "public" }), controllerHandler(getRandomPosts));

postRouter.post("/", authJWT, upload.fields([{ name: "images" }]), controllerHandler(createPost));
postRouter.post(
    "/upload-test",
    authTest,
    upload.fields([{ name: "images" }]),
    controllerHandler(async (req, res) => {
        const imgUrls = (req.files as { [fieldName: string]: Express.Multer.File[] }).images.map((f) => conf().CLIENT_DOMAIN + "/" + f.filename);

        if (!imgUrls || imgUrls.length < 1) {
            throw new BadReqError("There must be at least one image");
        }

        const sex = req.body.sex || "Male";
        // const sex = req.body.sex || req.user.profile.sex;
        if (!sex) {
            throw new BadReqError("Check your user profile field, sex");
        }

        const data: CreatePost = { userId: req.id, ...req.body, imgUrls, sex };
        const post = await createPostService(data, Prisma);
        const { id: mysqlId, ..._post } = post;

        /**
         * @TODO collection 이름을 동적 생성.
         * 배치잡을 통해 6개월이 지난 collection 일괄 삭제.
         * @TODO2 get-random-posts controller도 같이 수정.
         */
        const collectionName = createCollectionName(createYearMonthString(), POST_PRE_FIX);
        await createPostMongoService({ mysqlId, ..._post }, mongo.Db, collectionName);

        res.status(200).json(post);
    })
);

postRouter.post("/:id/favorite", authJWT, controllerHandler(createFavorite));
postRouter.delete("/:id/favorite/:favoriteId", authJWT, controllerHandler(deleteFavorite));

postRouter.post("/:id/scrap", authJWT, controllerHandler(createScrap));
postRouter.delete("/:id/scrap/:scrapId", authJWT, controllerHandler(deleteScrap));

export { postRouter };
