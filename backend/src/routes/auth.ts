import Router from "express";

import * as AuthController from "../controllers/authController";

const router = Router();

router.post("/signup", AuthController.signup_post);

router.post("/login", AuthController.login_post);

export default router;
