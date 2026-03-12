import { Event } from "../model/event.model.js";
import { User } from "../model/user.model.js";
import { Image } from "../model/image.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { cloudinaryDelete } from "../utils/cloudinary.js";
import { Like } from "../model/likes.model.js";
import { Notification } from "../model/notification.model.js";

const ensureOwnedEvent = async (eventId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found !");
  }

  if (event.user_id.toString() !== userId.toString()) {
    throw new ApiError(403, "You do not have access to this event");
  }

  return event;
};

const CreateEvent = AsyncHandler(async (req, res) => {
  const { name, description, date, location, type, contact } = req.body;

  if (!name || !description || !date || !location || !type || !contact) {
    throw new ApiError(400, "All fields are required");
  }

  let user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found !");
  }
  // console.log(user);
  const event = await Event.create({
    user_id: req.user._id,
    EventName: name,
    EventDescription: description,
    EventDate: date,
    EventLocation: location,
    EventType: type,
    ContactDetails: contact,
  });
  if (!event) {
    throw new ApiError(500, "Internal server error !!");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, event, "Successfully Event Created"));
});

const EditEvent = AsyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { ename, edescription, edate, elocation, etype, econtact } = req.body;

  let event = await ensureOwnedEvent(eventId, req.user._id);

  const UpdateEvent = {};

  if (ename) UpdateEvent.EventName = ename;
  if (edescription) UpdateEvent.EventDescription = edescription;
  if (edate) UpdateEvent.EventDate = edate;
  if (elocation) UpdateEvent.EventLocation = elocation;
  if (etype) UpdateEvent.EventType = etype;
  if (econtact) UpdateEvent.ContactDetails = econtact;

  event = await Event.findByIdAndUpdate(
    eventId,
    {
      $set: UpdateEvent,
    },
    { new: true }
  );
  if (!event) {
    throw new ApiError(
      500,
      "Internal server error occured while updating event details!"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, event, "Successfully event details updated"));
});

const DeleteEvent = AsyncHandler(async (req, res) => {
  const { eventId } = req.params;
  await ensureOwnedEvent(eventId, req.user._id);

  let images = await Image.find({ event_id: eventId });
  if (images.length > 0) {
    await Promise.all(
      images.map((image) =>
        cloudinaryDelete(image.image_public_id, image.resource_type)
      )
    );
    await Image.deleteMany({ event_id: eventId });
  }

  await Like.deleteMany({ event_id: eventId });
  await Notification.deleteMany({ imageId: { $in: images.map((img) => img._id) } });
  await Event.findByIdAndDelete(eventId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully event deleted"));
});

const GetAllEvent = AsyncHandler(async (req, res) => {
  const events = await Event.find({ user_id: req.user._id });

  if (events.length >= 0)
    return res
      .status(200)
      .json(new ApiResponse(200, events, "Successfully fetched all events"));

  throw new ApiError(404, "Event not found");
});

const EventDetails = AsyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { _id } = req.user;
  // console.log(eventId);
  if (!eventId || !_id) {
    throw new ApiError(401, "Unauthorized");
  }

  const combined_details = await Event.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(eventId),
        user_id: new mongoose.Types.ObjectId(_id),
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "event_id",
        as: "image_details",
        pipeline: [
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "image",
              as: "likes",
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "event_id",
        as: "resource_type_details",
        pipeline: [
          {
            $group: {
              _id: "$resource_type",
              count: {
                $sum: 1,
              },
            },
          },
        ],
      },
    },
  ]);

  // console.log("Print Combined details:", combined_details);
  if (combined_details.length >= 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { event_details: combined_details },
          "Successfully details fetched"
        )
      );
  }
  throw new ApiError(500, "Error occured while fetching events");
});
export { CreateEvent, EditEvent, DeleteEvent, GetAllEvent, EventDetails };
