import { env } from "../env";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { Customer, Restaurant, User } from "../models/entities";

const MAX_AGE = 21 * 12 * 30 * 24 * 60 * 60;

/**
 * @param  {number} id
 * @param  {string} role
 * @param  {string} email
 */
const generateToken = (id: number, role: string, email: string) => {
  return jwt.sign({ id, role, email }, env.app.accessTokenSecret, {
    expiresIn: MAX_AGE,
  });
};

/**
 * @param  {string} email
 * @param  {string} plainPassword
 * @param  {"customer"|"restaurant"} role
 * @param  {{restaurantDet?:restaurantDetIntf;customerDet?:customerDetInt;}} options
 */
const signUpUser = async (
  email: string,
  plainPassword: string,
  role: "customer" | "restaurant",
  options: {
    restaurantDet?: restaurantDetIntf;
    customerDet?: customerDetInt;
  }
) => {
  const password = await argon2.hash(plainPassword);
  try {
    const user = await User.create({ email, password, role });
    await user.save();
    let returningUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    if (role === "restaurant" && options.restaurantDet) {
      const rating = parseFloat((Math.random() * (5.0 - 3.7) + 3.7).toFixed(1));

      await Restaurant.create({
        userId: user.id,
        rating,
        ...options.restaurantDet,
      }).save();
    } else if (role === "customer" && options.customerDet) {
      //customer
      await Customer.create({
        userId: user.id,
        ...options.customerDet,
      }).save();
    }
    return { savedUser: returningUser, error: null };
  } catch (err) {
    if (err?.code === "23505") {
      return {
        loggedInUser: null,
        error: { message: "Email already registered" },
      };
    }
    return { savedUser: null, error: err };
  }
};

/**
 * @param  {string} email
 * @param  {string} plainPassword
 */
const loginUser = async (email: string, plainPassword: string) => {
  try {
    const user = await User.findOne({
      where: { email: email },
      relations: ["customer"],
    });
    if (!user) {
      const error = {
        field: "email",
        message: "Email not registered",
      };
      return { loggedInUser: null, error };
    }

    const valid = await argon2.verify(user.password, plainPassword);

    if (!valid) {
      const error = {
        field: "password",
        message: "incorrect password",
      };
      return { loggedInUser: null, error };
    }
    return {
      loggedInUser: {
        id: user.id,
        email: user.email,
        role: user.role,
        customer: user.customer,
      },
      error: null,
    };
  } catch (error) {
    return { loggedInUser: null, error };
  }
};

interface restaurantDetIntf {
  displayName?: string;
  phone?: string;
  address?: string;
  imgUrl?: string;
  city?: string;
  category?: string;
  isVeg?: boolean;
}

interface customerDetInt {
  displayName?: string;
  phone?: string;
  address?: string;
}

export { generateToken, MAX_AGE, signUpUser, loginUser };
