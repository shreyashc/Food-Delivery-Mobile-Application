import { Request, Response } from "express";
import { Restaurant } from "../models/entities";

const allRestaurants = async (_req: Request, res: Response) => {
  const restaurant = await Restaurant.find();
  console.log(restaurant);
  if (!restaurant) {
    return res.send("Not Found!");
  }
  return res.render("admin.pug", {
    restaurants: restaurant,
  });
};

export { allRestaurants };
