import Router from "express";
import { requireAuth } from "../middleware/authMiddleware";
import * as RestaurantController from "../controllers/restaurantController";

const router = Router();

router.get("/dashboard", requireAuth, RestaurantController.dashboard);
router.get("/dishes", requireAuth, RestaurantController.allDishes);

router.get("/add_dish", requireAuth, RestaurantController.addDish_get);

router.post("/add_dish", requireAuth, RestaurantController.addDish_post);

router.get("/edit_dish/:id", requireAuth, RestaurantController.editDish_get);

router.post("/edit_dish/:id", requireAuth, RestaurantController.editDish_post);

router.get("/delete_dish/:id", requireAuth, RestaurantController.deleteDish);

router.get("/edit_details/", requireAuth, RestaurantController.editDetails_get);

router.post(
  "/edit_details/",
  requireAuth,
  RestaurantController.editDetails_post
);
export default router;
