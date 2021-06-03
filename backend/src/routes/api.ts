import Router from "express";

import * as ApiController from "../controllers/apiController";

const router = Router();

router.get("/nearest_restautants", ApiController.getNearestRestaurants);

router.get(
  "/restautant_details_and_dishes/:id",
  ApiController.getRestaurantsDetailsAndDishes
);

export default router;
