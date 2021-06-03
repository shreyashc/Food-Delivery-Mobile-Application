import Router from "express";
import { Request, Response } from "express";

const router = Router();

router.get("", (_req: Request, res: Response) => res.redirect("/auth/login"));

export default router;
