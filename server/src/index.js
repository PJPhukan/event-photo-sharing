import "dotenv/config";
import express from "express";
import { app } from "./app.js";
import { MongoConnect } from "./db/index.js";

const port = process.env.PORT || 3000;



MongoConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(
        `♦️♦️ Memois web application running on  http://localhost:${port} ♦️♦️ `
      );
    });
  })
  .catch((error) => {
    console.error("MONGO CONNECTION ERROR !!! ", error);
  });
