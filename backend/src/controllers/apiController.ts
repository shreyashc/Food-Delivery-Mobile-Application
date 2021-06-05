import { NextFunction, Request, Response } from "express";
import { Restaurant } from "../models/entities";
import { generateToken, loginUser, signUpUser } from "./utils";

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

const signUp = async (req: Request, res: Response) => {
  const {
    email,
    password: plainPassword,
    displayName,
    phone,
    address,
  } = req.body;

  const customerDet = {
    displayName,
    phone,
    address,
  };

  try {
    const { savedUser, error } = await signUpUser(
      email,
      plainPassword,
      "customer",
      { customerDet }
    );

    if (error || !savedUser) {
      throw error;
    }

    res.status(201).json({ user: savedUser });
  } catch (err) {
    console.log(err);
    res.send(400).json({ err });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { loggedInUser: user, error } = await loginUser(email, password);

    if (error || !user) {
      throw error;
    }

    const token = generateToken(user.id, user.role, user.email);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json(error);
  }
};
export { getNearestRestaurants, getRestaurantsDetailsAndDishes, signUp, login };
