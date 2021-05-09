import Router from "express";
import { requireAuth, addUserToSession } from "../middleware/authMiddleware";
import * as RestaurantController from "../controllers/restaurantController";

const router = Router();

router.get(
  "/dashboard",
  requireAuth,
  addUserToSession,
  RestaurantController.dashboard
);
router.get(
  "/dishes",
  requireAuth,
  addUserToSession,
  RestaurantController.allDishes
);

router.get(
  "/add_dish",
  requireAuth,
  addUserToSession,
  RestaurantController.addDish_get
);

router.post(
  "/add_dish",
  requireAuth,
  addUserToSession,
  RestaurantController.addDish_post
);

router.get(
  "/edit_dish/:id",
  requireAuth,
  addUserToSession,
  RestaurantController.editDish_get
);

router.post(
  "/edit_dish/:id",
  requireAuth,
  addUserToSession,
  RestaurantController.editDish_post
);

router.get(
  "/delete_dish/:id",
  requireAuth,
  addUserToSession,
  RestaurantController.deleteDish
);
export default router;
