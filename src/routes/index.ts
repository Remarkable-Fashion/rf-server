import { Response, Request, Router } from "express";
import { controllerHandler } from "../lib/controller-handler";
import prisma from "../db/prisma";
import { authRouter } from "./auth";
import { postRouter } from "./post";
import { scrapRouter } from "./scrap";
import { userRouter } from "./user";
import { categoryRouter } from "./category";

const router = Router();

router.get(
    "/db-test",
    controllerHandler(async (req: Request, res: Response) => {
        const rv = await prisma.users.findMany({});

        res.json({ data: rv });
    })
);

router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/scrap", scrapRouter);
router.use("/user", userRouter);
router.use("/home/category", categoryRouter);

export { router };
