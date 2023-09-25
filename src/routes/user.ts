import { Router } from "express";
import { updateUserProfile } from "../domains/users/controller/update-user-profile";
import { controllerHandler } from "../lib/controller-handler";
import { authJWT } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { getUserById } from "../domains/users/controller/get-user-by-id";
import { createFollowing } from "../domains/users/controller/create-following";
import { deleteFollowing } from "../domains/users/controller/delete-following";
import { createBlockUser } from "../domains/users/controller/create-block-follower";
import { getMyFollowings } from "../domains/users/controller/get-my-followings";
import { getMyFollowers } from "../domains/users/controller/get-my-followers";
import { deleteBlockUser } from "../domains/users/controller/delete-block-follower";
import { getBlockUsers } from "../domains/users/controller/get-block-users";
import { deleteFollower } from "../domains/users/controller/delete-follower";

const userRouter = Router();

// userRouter.get("/me", authJWT, controllerHandler(getUserById));
// userRouter.patch("/me", authJWT, controllerHandler(updateUser));
userRouter.patch("/me/profile", authJWT, upload().fields([{ name: "avartar" }]), controllerHandler(updateUserProfile));

// userRouter.get("/following/:id", authJWT, controllerHandler(checkFollowing));
// userRouter.get("/following", authJWT, controllerHandler(getMyFollowings));
// userRouter.get("/follower", authJWT, controllerHandler(getMyFollowers));
userRouter.get("/following/:id", authJWT, controllerHandler(getMyFollowings));
userRouter.get("/follower/:id", authJWT, controllerHandler(getMyFollowers));

userRouter.post("/following/:id", authJWT, controllerHandler(createFollowing));
userRouter.delete("/following/:id", authJWT, controllerHandler(deleteFollowing));
userRouter.delete("/follower/:id", authJWT, controllerHandler(deleteFollower));

// userRouter.get("/block", authJWT, controllerHandler(getBlockUsers));
userRouter.get("/block/:id", authJWT, controllerHandler(getBlockUsers));
userRouter.post("/block/:id", authJWT, controllerHandler(createBlockUser));
userRouter.delete("/block/:id", authJWT, controllerHandler(deleteBlockUser));

userRouter.get("/:id", authJWT, controllerHandler(getUserById));

export { userRouter };
