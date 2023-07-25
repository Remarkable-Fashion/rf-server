import { Router } from "express";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { scrapRouter } from "./scrap";
import { userRouter } from "./user";
import { categoryRouter } from "./category";
import { searchRouter } from "./search";
import { clothesRouter } from "./clothes";

const router = Router();

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/scrap", scrapRouter);
router.use("/user", userRouter);
router.use("/home/category", categoryRouter);
router.use("/search", searchRouter);
router.use("/clothes", clothesRouter);

export { router };
