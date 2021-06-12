import { NextFunction, Request, Response } from "express";
import {
  Customer,
  Item,
  Order,
  OrderItem,
  Restaurant,
} from "../models/entities";
import { generateToken, loginUser, signUpUser } from "./utils";
import httpErrors from "http-errors";
import Stripe from "stripe";
import { env } from "../env";

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
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      throw new httpErrors.NotFound(`No restaurant matching ${id}`);
    }

    const restaurant = await Restaurant.findOne({
      where: { id },
      relations: ["items"],
    });

    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};

// TODO: api login signup

const signUp = async (req: Request, res: Response, next: NextFunction) => {
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
      throw new httpErrors.BadRequest(error);
    }

    res.status(201).json({ user: savedUser });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const { loggedInUser: user, error } = await loginUser(email, password);

    if (error || !user) {
      throw new httpErrors.BadRequest(error);
    }

    const token = generateToken(user.id, user.role, user.email);

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { restaurantId, items, deliveryAddress } = req.body;

  console.log(req.body);

  const customer = await Customer.findOne({
    userId: res.locals.user.id,
  });

  let totalAmount = 0;
  const ordered_items = await Item.findByIds(items);

  ordered_items.forEach((itm) => {
    totalAmount += itm.price;
  });

  const stripe = new Stripe(env.app.stripeSk, {
    apiVersion: "2020-08-27",
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
  });

  console.log(paymentIntent);

  const clientSecret = paymentIntent.client_secret;

  const order = await Order.create({
    customerId: customer?.id,
    restaurantId,
    totalAmount,
    deliveryAddress,
  }).save();

  await OrderItem.insert(
    ordered_items.map((itm) => {
      return { orderId: order.id, itemId: itm.id, itemName: itm.title };
    })
  );

  res.status(201).json({ clientSecret });
};

const myOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findOne({
      userId: res.locals.user.id,
    });

    if (!customer) {
      throw new httpErrors.NotFound();
    }

    const orders = await Order.find({
      where: { customerId: customer.id },
      relations: ["restaurant"],
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export {
  getNearestRestaurants,
  getRestaurantsDetailsAndDishes,
  signUp,
  login,
  createOrder,
  myOrders,
};
