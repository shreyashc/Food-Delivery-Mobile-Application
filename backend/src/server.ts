import express from "express";
import { createConnection } from "typeorm";
import { env } from "./env";
import { User, Customer, Restaurant } from "./models/entities/";

const main = async () => {
  const app = express();

  const conn = await createConnection({
    type: "postgres",
    host: env.db.host,
    port: env.db.port,
    database: env.db.databaseName,
    username: env.db.username,
    password: env.db.password,
    logging: env.db.logging,
    synchronize: env.db.synchronize,
    entities: [User, Customer, Restaurant],
    ssl: {
      rejectUnauthorized: false,
    },
  });

  console.log("db connection = " + conn.isConnected);

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
