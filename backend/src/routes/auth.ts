import Router from "express";
import { multer } from "../multer";

import * as AuthController from "../controllers/authController";

const router = Router();

router.get("/signup", AuthController.signup_web);
router.post("/signup", multer.single("image"), AuthController.signup_post);

router.get("/login", AuthController.login_web);
router.post("/login", AuthController.login_post);

router.get("/logout", AuthController.logout_web);

export default router;
