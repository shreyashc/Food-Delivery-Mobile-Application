import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import httpErrors, { HttpError } from "http-errors";
import * as path from "path";
import { createConnection } from "typeorm";
import { env } from "./env";
import {
  requireAdmin,
  requireAuth,
  requireRestaurant,
} from "./middleware/authMiddleware";
import {
  Customer,
  Item,
  Restaurant,
  User,
  Order,
  OrderItem,
  Review,
} from "./models/entities/";

import AdminRoutes from "./routes/admin";
import ApiRoutes from "./routes/api";
import AuthRoutes from "./routes/auth";
import HomeRoutes from "./routes/home";
import RestaurantRoutes from "./routes/restaurant";

const main = async () => {
  const app = express();

  //don't parse body for webhook
  app.use((req, res, next) => {
    if (req.originalUrl.includes("webhook")) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  //Pug View Engine
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "pug");

  /**
   * cors
   */
  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
          "https://foodzy-backend.herokuapp.com",
          "http://foodzy-backend.herokuapp.com",
          "http://localhost:4000",
          "http://localhost:19002",
          "http://localhost:19003",
          "http://localhost:19004",
          "http://localhost:19005",
          "http://localhost:19006",
        ];
        if (!origin) return callback(null, true);
        console.log(allowedOrigins.indexOf(origin) === -1);
        if (allowedOrigins.indexOf(origin) === -1) {
          var err = new Error("Origin not allowed");
          return callback(err, false);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ["POST", "PATCH", "GET", "OPTIONS", "HEAD", "DELETE"],
    })
  );

  app.set("trust proxy", true);
  app.use(express.static(path.join(__dirname, "../public")));

  /**
   * typeORM connection
   */
  await createConnection({
    type: "postgres",
    host: env.db.host,
    port: env.db.port,
    database: env.db.databaseName,
    username: env.db.username,
    password: env.db.password,
    logging: env.db.logging,
    synchronize: env.db.synchronize,
    entities: [User, Customer, Restaurant, Item, Order, OrderItem, Review],
    ssl: {
      rejectUnauthorized: false,
    },
  });

  /**
   * Routes
   */
  app.use("/", HomeRoutes);
  app.use("/auth", AuthRoutes);
  app.use("/restaurant", requireAuth, requireRestaurant, RestaurantRoutes);
  app.use("/admin", requireAuth, requireAdmin, AdminRoutes);
  app.use("/api/v1", ApiRoutes);

  //not found route
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new httpErrors.NotFound());
  });

  app.use(
    (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.status || 500);
      res.send({
        status: err.status || 500,
        message: err.message,
      });
      console.log(err.message);
    }
  );

  /**
   * create httpServer
   */
  const port = env.app.port || 4000;
  app.set("port", port);

  app.listen(port, () => {
    console.log("Server started on Port", port);
  });
};

main().catch((err) => console.log(err));
