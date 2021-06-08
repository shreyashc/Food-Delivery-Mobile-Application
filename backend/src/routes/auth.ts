import Router from "express";

import * as AuthController from "../controllers/authController";
import * as admin from "../controllers/admin";

const router = Router();

router.get("/signup", AuthController.signup_web);
router.post("/signup", AuthController.signup_post);

router.get("/login", AuthController.login_web);
router.post("/login", AuthController.login_post);

router.get("/logout", AuthController.logout_web);

router.get("/admin",admin.allRestaurants);
export default router;
