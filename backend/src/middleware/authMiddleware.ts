import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../env";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[env.app.cookieName];

  if (token) {
    jwt.verify(
      token,
      env.app.accessTokenSecret,
      (err: any, _decodedToken: any) => {
        if (err) {
          console.log(err.message);
          res.redirect("/auth/login");
        } else {
          next();
        }
      }
    );
  } else {
    res.redirect("/auth/login");
  }
};

const addUserToSession = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[env.app.cookieName];
  if (token) {
    jwt.verify(
      token,
      env.app.accessTokenSecret,
      async (err: any, decodedToken: any) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          const user = {
            id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
          };
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

export { requireAuth, addUserToSession };
