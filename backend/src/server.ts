import express from "express";
import * as path from "path";
import cookieParser from "cookie-parser";
import { createConnection } from "typeorm";
import { env } from "./env";
import { User, Customer, Restaurant, Item } from "./models/entities/";
import cors from "cors";
import AuthRoutes from "./routes/auth";
import HomeRoutes from "./routes/home";
import RestaurantRoutes from "./routes/restaurant";
import ApiRoutes from "./routes/api";

const main = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "pug");

  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
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

  console.log(env.db.synchronize);

  const conn = await createConnection({
    type: "postgres",
    host: env.db.host,
    port: env.db.port,
    database: env.db.databaseName,
    username: env.db.username,
    password: env.db.password,
    logging: env.db.logging,
    synchronize: env.db.synchronize,
    entities: [User, Customer, Restaurant, Item],
    ssl: {
      rejectUnauthorized: false,
    },
  });

  console.log("db connection = " + conn.isConnected);

  app.use("/", HomeRoutes);
  app.use("/auth", AuthRoutes);
  app.use("/restaurant", RestaurantRoutes);
  app.use("/api/v1", ApiRoutes);

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
