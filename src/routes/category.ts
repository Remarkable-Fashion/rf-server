import { Router } from "express";
import { controllerHandler } from "../lib/controller-handler";
import { findSeasonsController, findStylesController, findTposController } from "../domains/home/controller";

const categoryRouter = Router();

categoryRouter.get("/tpo", controllerHandler(findTposController));
categoryRouter.get("/season", controllerHandler(findSeasonsController));
categoryRouter.get("/style", controllerHandler(findStylesController));

export { categoryRouter };
