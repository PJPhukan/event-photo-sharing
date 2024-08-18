import { Router } from "express";
import { VerifyJwtToken } from "../libs/auth.helpers.js";
import {
  getAllNotification,
  markNotificationAsRead,
  deleteNotification,
} from "../controller/notification.controller.js";

const router = Router();

router.route("/get-all-notification").get(VerifyJwtToken, getAllNotification);

router.route("/mark-as-read/:notificationId").patch(
  VerifyJwtToken,
  markNotificationAsRead
);

router.route("/delete-notification/:notificationId").delete(
  VerifyJwtToken,
  deleteNotification
);

export default router;