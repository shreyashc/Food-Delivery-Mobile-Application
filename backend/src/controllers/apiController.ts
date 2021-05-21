import { NextFunction, Request, Response } from "express";
import { Restaurant } from "../models/entities";

const getNearestRestaurants = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const city: string = (req.query.city as string) || "hassan";
  const restaurants = await Restaurant.find({
    city,
  });

  res.status(200).json(restaurants);
};

const getRestaurantsDetailsAndDishes = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const id = parseInt(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "restaurant not found" });
  }
  const restaurant = await Restaurant.findOne({
    where: { id },
    relations: ["items"],
  });

  return res.status(200).json(restaurant);
};

// TODO: api login signup

export { getNearestRestaurants, getRestaurantsDetailsAndDishes };
