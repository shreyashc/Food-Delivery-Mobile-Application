import { Request, Response } from "express";
import { env } from "../env";
import { generateToken, loginUser, MAX_AGE, signUpUser } from "./utils";

const signup_web = (_req: Request, res: Response) => {
  res.render("signup.pug", {
    nav: { navbutton: "Login", link: "/auth/login" },
  });
};
const login_web = (_req: Request, res: Response) => {
  res.render("login.pug", {
    nav: { navbutton: "Signup", link: "/auth/signup" },
  });
};

const logout_web = (_req: Request, res: Response) => {
  res.cookie(env.app.cookieName, "", { maxAge: 1 });
  res.redirect("/auth/login");
};

const signup_post = async (req: Request, res: Response) => {
  const {
    email,
    password: plainPassword,
    displayName,
    phone,
    address,
    imgUrl,
    city,
    category,
    isVeg: isVegStr,
  } = req.body;

  const isVeg = isVegStr === "on" ? true : false;

  const restaurantDet = {
    displayName,
    phone,
    address,
    imgUrl,
    city,
    category,
    isVeg,
  };

  try {
    const { savedUser, error } = await signUpUser(
      email,
      plainPassword,
      "restaurant",
      { restaurantDet }
    );
    if (error || !savedUser) {
      throw error;
    }
    const token = generateToken(savedUser.id, savedUser.role, savedUser.email);

    res.cookie(env.app.cookieName, token, {
      httpOnly: true,
      maxAge: MAX_AGE * 1000,
    });
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    res.status(400).render("signup.pug", {
      nav: { navbutton: "Login", link: "/auth/login" },
      error: err,
    });
  }
};

const login_post = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { loggedInUser: user, error } = await loginUser(email, password);

    if (error || !user) {
      throw error;
    }

    const token = generateToken(user.id, user.role, user.email);
    res.cookie(env.app.cookieName, token, {
      httpOnly: true,
      maxAge: MAX_AGE * 1000,
    });
    if (user.role === "restaurant")
      return res.redirect("/restaurant/dashboard");
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).render("login.pug", {
      error,
      nav: { navbutton: "Signup", link: "/auth/signup" },
    });
  }
};

export { signup_web, login_web, signup_post, login_post, logout_web };
