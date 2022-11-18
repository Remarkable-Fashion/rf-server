import { Response, Request, Router } from "express";
import { controllerHandler } from "../lib/controller-handler";
import prisma from "../db/prisma";

const router = Router();

router.get(
    "/db-test",
    controllerHandler(async (req: Request, res: Response) => {
        const rv = await prisma.user.findMany({});

        res.json({ data: rv });
    })
);

export { router };
