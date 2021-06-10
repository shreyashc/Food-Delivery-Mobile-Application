import { NextFunction, Request, Response } from "express";
import { Item, Restaurant } from "../models/entities";

const dashboard = async (_req: Request, res: Response, _next: NextFunction) => {
  const restaurant = await Restaurant.findOne({
    userId: res.locals.user.id,
  });

  res.render("restaurant/dashboard.pug", {
    nav: { navbutton: "Logout", link: "/auth/logout" },
    restaurant,
  });
};
const allDishes = async (_req: Request, res: Response, _next: NextFunction) => {
  const restaurant = await Restaurant.findOne({
    where: { userId: res.locals.user.id },
    relations: ["items"],
    order: { id: "ASC" },
  });

  if (!restaurant) {
    return res.send("Not Found");
  }
  return res.render("restaurant/dishes.pug", {
    nav: { navbutton: "Logout", link: "/auth/logout" },
    items: restaurant.items,
  });
};

const addDish_get = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.render("restaurant/add_dish.pug", {
    nav: { navbutton: "Logout", link: "/auth/logout" },
  });
};

const editDish_get = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const itemId = parseInt(req.params.id);
  const userId = res.locals.user.id;

  if (!itemId) {
    return res.status(400).send("Not Found");
  }

  const restaurant = await Restaurant.findOne({ userId });

  if (!restaurant) return res.send("Something Went Wrong");

  const item = await Item.findOne({ id: itemId, restaurantId: restaurant.id });

  return res.render("restaurant/edit_dish.pug", {
    nav: { navbutton: "Logout", link: "/auth/logout" },
    item,
  });
};

const addDish_post = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const {
      title,
      description,
      isVeg: isVegStr,
      imgUrl,
      price,
      category,
    } = req.body;
    console.log(isVegStr);

    const restaurant = await Restaurant.findOne({ userId });

    if (!restaurant) return res.send("Something Went Wrong");

    const isVeg = isVegStr === "on" ? true : false;

    await Item.create({
      title,
      description,
      isVeg,
      imgUrl,
      price,
      category,
      restaurantId: restaurant.id,
    }).save();
    return res.redirect("/restaurant/dishes");
  } catch (error) {
    res.send(error);
  }
};

const editDish_post = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const userId = res.locals.user.id;
    const {
      title,
      description,
      isVeg: isVegStr,
      imgUrl,
      price,
      category,
    } = req.body;
    const restaurant = await Restaurant.findOne({ userId });
    const itemId = parseInt(req.params.id);

    if (!restaurant) return res.send("Something Went Wrong");

    const isVeg = isVegStr === "on" ? true : false;

    await Item.update(
      {
        id: itemId,
        restaurantId: restaurant.id,
      },
      {
        title,
        description,
        isVeg,
        imgUrl,
        price,
        category,
        restaurantId: restaurant.id,
      }
    );
    return res.redirect("/restaurant/dishes");
  } catch (error) {
    res.send(error);
  }
};

const deleteDish = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const userId = res.locals.user.id;

    const restaurant = await Restaurant.findOne({ userId });
    const itemId = parseInt(req.params.id);

    if (!restaurant) return res.send("Something Went Wrong");

    await Item.delete({
      id: itemId,
      restaurantId: restaurant.id,
    });
    return res.redirect("/restaurant/dishes");
  } catch (error) {
    res.send(error);
  }
};

const editDetails_get = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const restaurant = await Restaurant.findOne({
    userId: res.locals.user.id,
  });

  res.render("restaurant/update_details.pug", {
    nav: { navbutton: "Logout", link: "/auth/logout" },
    restaurant,
  });
};

const editDetails_post = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const {
    displayName,
    phone,
    imgUrl,
    address,
    city,
    category,
    isVeg: isVegStr,
  } = req.body;

  const isVeg = isVegStr === "on" ? true : false;

  await Restaurant.update(
    {
      userId: res.locals.user.id,
    },
    {
      displayName,
      phone,
      imgUrl,
      address,
      category,
      isVeg,
      city,
    }
  );

  res.redirect("/restaurant/dashboard");
};

export {
  dashboard,
  addDish_get,
  allDishes,
  addDish_post,
  editDish_get,
  editDish_post,
  deleteDish,
  editDetails_get,
  editDetails_post,
};
