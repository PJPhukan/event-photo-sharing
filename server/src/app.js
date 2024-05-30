import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./route/user.route.js";

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

//All routes
app.use("/auth/user", userRouter);

export { app };
