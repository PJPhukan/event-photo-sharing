import { app } from "../src/app.js";
import { MongoConnect } from "../src/db/index.js";

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await MongoConnect();
    isConnected = true;
  }
  return app(req, res);
}
