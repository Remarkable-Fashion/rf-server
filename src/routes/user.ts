import { Router } from "express";
import { updateUser } from "../domains/users/controller/update-user";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT, authTest } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { getUserById } from "../domains/users/controller/get-user-by-id";

const userRouter = Router();

userRouter.get("/:id", authJWT, controllerHandler(getUserById));
userRouter.get("/test/:id", authTest, controllerHandler(getUserById));

userRouter.patch("/:id", authJWT, upload.fields([{ name: "avartar" }]), controllerHandler(updateUser));
userRouter.patch("/test/:id", authTest, upload.fields([{ name: "avartar" }]), controllerHandler(updateUser));

export { userRouter };
