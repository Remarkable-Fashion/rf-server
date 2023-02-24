import { Router } from "express";
import { updateUser } from "../domains/users/controller/update-user";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";

const userRouter = Router();

userRouter.patch("/:id", authJWT, controllerHandler(updateUser));

export { userRouter };
