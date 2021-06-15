import Router from "express";
import express from "express";
import * as ApiController from "../controllers/apiController";
import { requireAuthApi } from "../middleware/authMiddleware";

const router = Router();

//auth
router.post("/signup", ApiController.signUp);
router.post("/login", ApiController.login);

//restaurants
router.get("/nearest_restautants", ApiController.getNearestRestaurants);
router.get(
  "/restautant_details_and_dishes/:id",
  ApiController.getRestaurantsDetailsAndDishes
);

/**
 * Orders
 */
router.post("/order", requireAuthApi, ApiController.createOrder);
router.get("/myorders", requireAuthApi, ApiController.myOrders);
router.get(
  "/orderdetails/:orderid",
  requireAuthApi,
  ApiController.orderDetails
);

/**
 * stripe webhook
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  ApiController.handleWebHook
);

export default router;
