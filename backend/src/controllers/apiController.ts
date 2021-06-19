import { NextFunction, Request, Response } from "express";
import {
  Customer,
  Item,
  Order,
  OrderItem,
  Restaurant,
  Review,
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
    activated: true,
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

const getRestaurantsReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      throw new httpErrors.NotFound(`No restaurant matching ${id}`);
    }
    const reviews = await Review.find({
      where: { restaurantId: id },
      relations: ["customer"],
    });

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

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

    const token = generateToken(user.id, user.role, user.email, {
      customerId: user.customer.id,
    });

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    const clientSecret = paymentIntent.client_secret || "";

    const order = await Order.create({
      customerId: customer?.id,
      restaurantId,
      totalAmount,
      deliveryAddress,
      clientSecret,
    }).save();

    await OrderItem.insert(
      ordered_items.map((itm) => {
        return {
          orderId: order.id,
          itemId: itm.id,
          itemName: itm.title,
          itemDescription: itm.description,
          itemPrice: itm.price,
        };
      })
    );

    res.status(201).json({ clientSecret });
  } catch (error) {
    next(error);
  }
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
      order: { createdAt: "DESC" },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const orderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = parseInt(req.params.orderid);

    const customer = await Customer.findOne({
      userId: res.locals.user.id,
    });

    if (!customer) {
      throw new httpErrors.NotFound();
    }

    const order = await Order.findOne({
      where: { customerId: customer.id, id: orderId },
      relations: ["restaurant", "items"],
    });

    if (!order) {
      throw new httpErrors.NotFound();
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const canIPostReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(res.locals);
    const customerId = res.locals.user.customerId;
    const restaurantId = parseInt(req.query.restaurantId as string);

    if (!customerId) {
      throw new httpErrors.BadRequest("Customer not found");
    }

    const reviewPresent = await Review.findOne({ restaurantId, customerId });

    if (reviewPresent) {
      return res.json({ canIReview: false });
    }

    const orderd = await Order.find({ restaurantId, customerId });

    if (orderd.length > 0) {
      return res.json({ canIReview: true });
    }

    return res.json({ canIReview: false });
  } catch (error) {
    return next(error);
  }
};

const postAReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(res.locals);

    const customerId = res.locals.user.customerId;

    if (!customerId) {
      throw new httpErrors.BadRequest("Customer not found");
    }

    const {
      restaurantId,
      foodQuality,
      foodQuantity,
      foodDelivery,
      description,
    } = req.body;

    const reviewPresent = await Review.findOne({ restaurantId, customerId });

    if (reviewPresent) {
      throw new httpErrors.BadRequest("Review already exists");
    }

    const orderd = await Order.find({ restaurantId, customerId });

    if (!orderd) {
      throw new httpErrors.BadRequest("You should order first");
    }

    if (
      !restaurantId ||
      !description ||
      foodQuality < 0 ||
      foodQuality > 5 ||
      foodQuantity < 0 ||
      foodQuantity > 5 ||
      foodDelivery < 0 ||
      foodDelivery > 5
    ) {
      throw new httpErrors.BadRequest("Invalid args");
    }

    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId },
      relations: ["reviews"],
    });

    if (!restaurant) {
      throw new httpErrors.BadRequest("No such restaurant");
    }

    await Review.create({
      customerId,
      restaurantId,
      foodQuality,
      foodQuantity,
      foodDelivery,
      description,
    }).save();

    const custRating = (foodQuality + foodQuantity + foodDelivery) / 3;
    const noOfReviews = restaurant.reviews.length + 1;

    const newRating =
      (parseFloat(restaurant.rating as any) * noOfReviews + custRating) /
      (noOfReviews + 1);

    await Restaurant.update(
      {
        id: restaurant.id,
      },
      {
        rating: newRating,
      }
    );
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const handleWebHook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      throw new httpErrors.BadRequest();
    }

    const stripe = new Stripe(env.app.stripeSk, {
      apiVersion: "2020-08-27",
    });
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.app.stripeEndpointSecret
    );

    const parsedReq = JSON.parse(req.body);
    const clientSecret = parsedReq?.data?.object?.client_secret;

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        if (clientSecret) {
          await Order.update(
            {
              clientSecret,
            },
            {
              paymentStatus: 1,
            }
          );
        }
        console.log(paymentIntent);
        console.log("PaymentIntent was successful!");

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        if (clientSecret) {
          const newOrder = await Order.update(
            {
              clientSecret,
            },
            {
              paymentStatus: 2,
            }
          );
          console.log("updating", newOrder, clientSecret, "....");
        }
        console.log(paymentIntent);
        console.log("PaymentIntent was Failed!");
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.log(error);

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
  orderDetails,
  handleWebHook,
  postAReview,
  getRestaurantsReviews,
  canIPostReview,
};
