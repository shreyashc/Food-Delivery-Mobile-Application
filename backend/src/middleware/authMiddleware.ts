import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../env";
import httpErrors from "http-errors";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[env.app.cookieName];

  if (token) {
    jwt.verify(
      token,
      env.app.accessTokenSecret,
      (err: any, decodedToken: any) => {
        if (err) {
          console.log(err.message);
          res.redirect("/auth/login");
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
    res.redirect("/auth/login");
  }
};

const requireAuthApi = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers["authorization"]) return next(new httpErrors.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  if (token) {
    jwt.verify(
      token,
      env.app.accessTokenSecret,
      async (err: any, decodedToken: any) => {
        if (err) {
          res.locals.user = null;
          throw new httpErrors.Unauthorized();
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
    next(new httpErrors.Unauthorized());
  }
};

export { requireAuth, requireAuthApi };
