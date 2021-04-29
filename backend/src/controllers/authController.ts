import { User } from "src/models/entities";
import { Request, Response } from "express";
import argon2 from "argon2";
import { env } from "src/env";
import { generateToken, MAX_AGE } from "./utils";

const signup_web = (_req: Request, res: Response) => {
  //render signup page
  res.sendStatus(204);
};
const login_web = (_req: Request, res: Response) => {
  //render login page
  res.sendStatus(204);
};

const logout_web = (_req: Request, res: Response) => {
  res.cookie(env.app.cookieName, "", { maxAge: 1 });
  res.redirect("/");
};

const signup_post = async (req: Request, res: Response) => {
  const { email, password: plainPassword, role } = req.body;

  //hash password
  const password = await argon2.hash(plainPassword);

  if (!(role === "customer" || role === "restaurant")) {
    res.status(400).json({ role: "invalid role" });
  }
  try {
    const user = await User.create({ email, password, role });
    await user.save();
    const token = generateToken(user.id, role);
    res.cookie(env.app.cookieName, token, {
      httpOnly: true,
      maxAge: MAX_AGE * 1000,
    });
    res.status(201).json({ user: user.id, token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const login_post = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const _errors = [
        {
          field: "email",
          message: "Email not registered",
        },
      ];
      console.log(_errors);
      //todo return error
      return;
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      const _errors = [
        {
          field: "password",
          message: "incorrect password",
        },
      ];
      console.log(_errors);

      return;
    }

    const token = generateToken(user.id, user.role);
    res.cookie(env.app.cookieName, token, {
      httpOnly: true,
      maxAge: MAX_AGE * 1000,
    });
    res.status(200).json({ user: user.id, role: user.role });
  } catch (err) {
    console.log(err);
  }
};

export { signup_web, login_web, signup_post, login_post, logout_web };
