import express from "express";

const main = async () => {
  const app = express();

  /**
   * create httpServer
   */
  const port = 4000;
  app.set("port", port);

  app.listen(port, () => {
    console.log("Server started on Port", port);
  });
};

main().catch((err) => console.log(err));
