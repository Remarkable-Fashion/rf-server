import { Router } from "express";
import { updateUser } from "../domains/users/controller/update-user";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT, authTest } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { getUserById } from "../domains/users/controller/get-user-by-id";
import { createFollowing } from "../domains/users/controller/create-following";
import { deleteFollowing } from "../domains/users/controller/delete-following";
import { createBlockFollower } from "../domains/users/controller/create-block-follower";
import { checkFollowing } from "../domains/users/controller/check-following";
import { getMyFollowings } from "../domains/users/controller/get-my-followings";
import { getMyFollowers } from "../domains/users/controller/get-my-followers";
import { deleteBlockFollower } from "../domains/users/controller/delete-block-follower";
import { getBlockUsers } from "../domains/users/controller/get-block-users";
import { getUserByIdTest } from "../domains/users/controller/get-user-by-id-test";

const userRouter = Router();

userRouter.get("/me", authJWT, controllerHandler(getUserById));
userRouter.get("/me/test", controllerHandler(getUserByIdTest));
userRouter.get("/metest", authTest(), controllerHandler(getUserById));

// userRouter.get("/:id", authJWT, controllerHandler(getUserById));
// userRouter.get("/test/:id", authTest(), controllerHandler(getUserById));

userRouter.patch("/me", authJWT, upload.fields([{ name: "avartar" }]), controllerHandler(updateUser));
userRouter.patch("/test/:id", authTest(), upload.fields([{ name: "avartar" }]), controllerHandler(updateUser));

userRouter.get("/following/:id", authJWT, controllerHandler(checkFollowing));
userRouter.get("/following", authJWT, controllerHandler(getMyFollowings));
userRouter.get("/follower", authJWT, controllerHandler(getMyFollowers));

userRouter.post("/following/:id", authJWT, controllerHandler(createFollowing));
userRouter.delete("/following/:id", authJWT, controllerHandler(deleteFollowing));

userRouter.get("/block", authJWT, controllerHandler(getBlockUsers));
userRouter.post("/block/:id", authJWT, controllerHandler(createBlockFollower));
userRouter.delete("/block/:id", authJWT, controllerHandler(deleteBlockFollower));

export { userRouter };
