import Router from "express";

import * as AdminController from "../controllers/admin";

const router = Router();

router.get("/", AdminController.allRestaurants);
router.get("/delete/:id", AdminController.deleteRestaurant);

export default router;
