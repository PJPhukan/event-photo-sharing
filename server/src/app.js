import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./route/user.route.js";
import { ApiError } from "./utils/ApiError.js";
const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

//All routes
app.use("/auth/user", userRouter);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export { app };
