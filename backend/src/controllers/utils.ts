import { env } from "../env";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { Restaurant, User } from "../models/entities";

const MAX_AGE = 21 * 12 * 30 * 24 * 60 * 60;
const generateToken = (id: number, role: string, email: string) => {
  return jwt.sign({ id, role, email }, env.app.accessTokenSecret, {
    expiresIn: MAX_AGE,
  });
};

const signUpUser = async (
  email: string,
  plainPassword: string,
  role: "customer" | "restaurant"
) => {
  const password = await argon2.hash(plainPassword);
  try {
    const user = await User.create({ email, password, role });
    await user.save();
    const res = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    if (role === "restaurant") {
      await Restaurant.create({ userId: user.id }).save();
    }
    return { savedUser: res, error: null };
  } catch (err) {
    return { savedUser: null, error: err };
  }
};

const loginUser = async (email: string, plainPassword: string) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = [
        {
          field: "email",
          message: "Email not registered",
        },
      ];
      return { loggedInUser: null, error };
    }

    const valid = await argon2.verify(user.password, plainPassword);

    if (!valid) {
      const error = [
        {
          field: "password",
          message: "incorrect password",
        },
      ];
      return { loggedInUser: null, error };
    }
    return {
      loggedInUser: { id: user.id, email: user.email, role: user.role },
      error: null,
    };
  } catch (error) {
    return { loggedInUser: null, error };
  }
};

export { generateToken, MAX_AGE, signUpUser, loginUser };
