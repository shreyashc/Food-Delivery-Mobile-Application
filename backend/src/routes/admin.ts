import Router from "express";

import * as AdminController from "../controllers/adminController";

const router = Router();

router.get("/dashboard", (_req, res, _next) =>
  res.render("admin/dashboard.pug", {
    nav: { navbutton: "Logout", link: "/auth/logout" },
  })
);

router.get("/all_restaurants", AdminController.allRestaurants);

router.get("/manage_restaurant/:id", AdminController.completeRestaurantDetails);

router.get("/delete/:id", AdminController.deleteRestaurant);
router.get("/activate/:id", AdminController.activateRestaurant);

router.post("/mark-as-paid/", AdminController.markAsPaid);

export default router;
