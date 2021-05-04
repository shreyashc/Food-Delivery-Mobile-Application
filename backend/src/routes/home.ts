import Router from "express";
import { Request, Response } from "express";

const router = Router();

router.get("", (_req: Request, res: Response) =>
  res.render("index.pug", { name: "foodzy" })
);

export default router;
