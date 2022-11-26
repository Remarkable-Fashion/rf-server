import { Response, Request, Router } from "express";
import { controllerHandler } from "../lib/controller-handler";
import prisma from "../db/prisma";
import { authRouter } from "./auth";
import { postRouter } from "./post";

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

export { router };
