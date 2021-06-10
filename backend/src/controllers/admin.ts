import { NextFunction, Request, Response } from "express";
import { Restaurant, User } from "../models/entities";

const allRestaurants = async (_req: Request, res: Response) => {
  const restaurants = await Restaurant.find();
  return res.render("admin.pug", {
    restaurants: restaurants,
  });
};

const deleteRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.send("User Not Found");
    }

    await user.remove();

    return res.redirect("/admin");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export { allRestaurants, deleteRestaurant };
