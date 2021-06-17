import Router from "express";
import { multer } from "../multer";
import * as RestaurantController from "../controllers/restaurantController";

const router = Router();

/**
 * dashboard and details
 */
router.get("/dashboard", RestaurantController.dashboard);
router.get("/edit_details/", RestaurantController.editDetails_get);
router.post("/edit_details/", RestaurantController.editDetails_post);

/**
 * Dishes and Menu
 */
router.get("/dishes", RestaurantController.allDishes);
router.get("/add_dish", RestaurantController.addDish_get);
router.post(
  "/add_dish",
  multer.single("image"),
  RestaurantController.addDish_post
);
router.get("/edit_dish/:id", RestaurantController.editDish_get);
router.post("/edit_dish/:id", RestaurantController.editDish_post);
router.get("/delete_dish/:id", RestaurantController.deleteDish);

/**
 * Orders
 */
router.get("/all_orders/", RestaurantController.getAllOrders);
router.get("/order_details/:orderid", RestaurantController.getOrderDetails);
router.post("/update_order_status/", RestaurantController.updateOrderStatus);

export default router;
