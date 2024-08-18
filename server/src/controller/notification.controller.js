import { Notification } from "../model/notification.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllNotification = AsyncHandler(async (req, res) => {
  if (!req.user._id) {
    throw new ApiError(401, "Unauthorized");
  }
  const notifications = await Notification.find({ owner_id: req.user._id })
    .sort({ createdAt: -1 })
    .exec();
  console.log("All notification:", notifications);

  if (notifications.length >= 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notifications,
          "Successfully notification retrived"
        )
      );
  }
  throw new ApiError(500, "Error occured while retriving user notifications");
});

const markNotificationAsRead = AsyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully notification as read"));
});

const deleteNotification = AsyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findByIdAndDelete(notificationId);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully notification deleted"));
});

export { getAllNotification, markNotificationAsRead, deleteNotification };
