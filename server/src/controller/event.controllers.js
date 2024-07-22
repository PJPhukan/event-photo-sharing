import { Event } from "../model/eveny.model.js";
import { User } from "../model/user.model.js";
import { Image } from "../model/image.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const CreateEvent = AsyncHandler(async (req, res) => {
  const { name, description, date, location, type, contact } = req.body;

  if (!name && !description && !date && !location && !type && !contact) {
    throw new ApiError(400, "All fields are required");
  }
  let user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found !");
  }
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

  let event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found !");

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
  let event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found !");
  let deleteAll = await Image.find({ event_id: eventId });
  await event.remove();
  await deleteAll.remove();
  return res
    .status(200)
    .json(new ApiResponse(200, event, "Successfully event deleted"));
});

const GetAllEvent = AsyncHandler(async (req, res) => {
  const events = await Event.find({ user_id: req.user._id });
  if (!events) throw new ApiError(404, "Event not found");
  return res
    .status(200)
    .json(new ApiResponse(200, events, "Successfully fetched all events"));
});
export { CreateEvent, EditEvent, DeleteEvent, GetAllEvent };
