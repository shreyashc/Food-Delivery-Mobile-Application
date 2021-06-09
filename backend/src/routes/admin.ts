import Router from "express";

import * as admin from "../controllers/admin";

const router = Router();



router.get("/admin",admin.allRestaurants);
router.get("admin/delete/:id",admin.deleteRestaurant)
export default router;
