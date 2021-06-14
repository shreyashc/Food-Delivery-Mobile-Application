import { NextFunction, Request, Response } from "express";
import HttpErrors from "http-errors";
import { getConnection, getRepository } from "typeorm";
import { Order, Restaurant, User } from "../models/entities";

const allRestaurants = async (_req: Request, res: Response) => {
  const restaurants = await Restaurant.find();
  return res.render("admin/all_restaurants.pug", {
    restaurants: restaurants,
    nav: { navbutton: "Logout", link: "/auth/logout" },
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

    return res.redirect("/admin/all_restaurants");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const activateRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = parseInt(req.params.id);
    await Restaurant.update(
      {
        id: restaurantId,
      },
      {
        activated: true,
      }
    );
    return res.redirect("/admin/all_restaurants");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const completeRestaurantDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = parseInt(req.params.id);

    const restaurant = await getRepository(Restaurant)
      .createQueryBuilder("restaurant")
      .innerJoinAndSelect("restaurant.user", "user")
      .leftJoinAndSelect("restaurant.items", "item")
      .leftJoinAndSelect("restaurant.orders", "order")
      .leftJoinAndSelect("order.customer", "customer")
      .where("restaurant.id = :id", { id: restaurantId })
      .orderBy("order.createdAt", "DESC")
      .getOne();

    return res.render("admin/manage_restaurant.pug", {
      restaurant,
      nav: { navbutton: "Logout", link: "/auth/logout" },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const markAsPaid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderids: number[] = req.body.orderids;
    const restaurantid: number = req.body.restaurantid;

    if (!orderids?.length) {
      throw new HttpErrors.BadRequest();
    }

    await getConnection()
      .createQueryBuilder()
      .update(Order)
      .set({ paidToRestaurant: true })
      .whereInIds(orderids)
      .execute();

    return res.redirect(`/admin/manage_restaurant/${restaurantid}`);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export {
  allRestaurants,
  deleteRestaurant,
  completeRestaurantDetails,
  markAsPaid,
  activateRestaurant,
};
