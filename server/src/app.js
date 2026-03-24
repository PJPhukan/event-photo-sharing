import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./route/user.route.js";
import eventRouter from "./route/event.route.js";
import imageRouter from "./route/image.route.js";
import likeRouter from "./route/like.route.js";
import dashboardRouter from "./route/dashboard.route.js";
import faceRouter from "./route/recognition.route.js";
import notifcationRouter from "./route/notification.route.js";
import favoriteRouter from "./route/favorite.route.js";
import collectionRouter from "./route/collection.route.js";
import cardDesignRouter from "./route/cardDesign.route.js";
import { ApiError } from "./utils/ApiError.js";
const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin:
      allowedOrigins.length > 0
        ? allowedOrigins
        : ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Memois API is healthy",
    uptime: process.uptime(),
  });
});

//All routes
app.use("/api/auth/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/image", imageRouter);
app.use("/api/like", likeRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/face-recognition", faceRouter);
app.use("/api/notification", notifcationRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/collection", collectionRouter);
app.use("/api/cards", cardDesignRouter);

app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

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
