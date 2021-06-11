import Router from "express";

import * as ApiController from "../controllers/apiController";
import { requireAuthApi } from "../middleware/authMiddleware";

const router = Router();

router.get("/nearest_restautants", ApiController.getNearestRestaurants);

router.get(
  "/restautant_details_and_dishes/:id",
  ApiController.getRestaurantsDetailsAndDishes
);

router.post("/signup", ApiController.signUp);

router.post("/login", ApiController.login);

router.post("/order", requireAuthApi, ApiController.createOrder);

export default router;
