import mongoose from "mongoose";
import { CardDesign } from "../model/cardDesign.model.js";
import { Event } from "../model/event.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const SaveCardDesign = AsyncHandler(async (req, res) => {
  const { eventId, elements, background, backgroundImage, canvasSize, templateId, name } =
    req.body;

  if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }
  if (!canvasSize?.width || !canvasSize?.height) {
    throw new ApiError(400, "Canvas size is required");
  }

  const event = await Event.findOne({
    _id: eventId,
    user_id: req.user._id,
  })
    .select("_id")
    .exec();
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const card = await CardDesign.create({
    user_id: req.user._id,
    event_id: eventId,
    elements: elements || {},
    background: background ?? null,
    backgroundImage: backgroundImage ?? null,
    canvasSize,
    templateId: templateId || "clean-light",
    name: name || "Untitled",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, card, "Card design saved"));
});

const GetCardsByEvent = AsyncHandler(async (req, res) => {
  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new ApiError(400, "Invalid event id");
  }

  const cards = await CardDesign.find({
    event_id: eventId,
    user_id: req.user._id,
  })
    .sort({ updatedAt: -1 })
    .exec();

  return res
    .status(200)
    .json(new ApiResponse(200, cards, "Card designs fetched"));
});

const UpdateCardDesign = AsyncHandler(async (req, res) => {
  const { cardId } = req.params;
  const { elements, background, backgroundImage, canvasSize, templateId, name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new ApiError(400, "Invalid card id");
  }

  const update = {};
  if (elements !== undefined) update.elements = elements;
  if (background !== undefined) update.background = background;
  if (backgroundImage !== undefined) update.backgroundImage = backgroundImage;
  if (canvasSize?.width && canvasSize?.height) update.canvasSize = canvasSize;
  if (templateId) update.templateId = templateId;
  if (name !== undefined) update.name = name || "Untitled";

  const card = await CardDesign.findOneAndUpdate(
    { _id: cardId, user_id: req.user._id },
    { $set: update },
    { new: true }
  );

  if (!card) {
    throw new ApiError(404, "Card design not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, card, "Card design updated"));
});

const DeleteCardDesign = AsyncHandler(async (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new ApiError(400, "Invalid card id");
  }

  const deleted = await CardDesign.deleteOne({
    _id: cardId,
    user_id: req.user._id,
  });

  if (!deleted?.deletedCount) {
    throw new ApiError(404, "Card design not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Card design deleted"));
});

const GetSharedCard = AsyncHandler(async (req, res) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    throw new ApiError(400, "Invalid card id");
  }

  const card = await CardDesign.findById(cardId).exec();
  if (!card) {
    throw new ApiError(404, "Card design not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, card, "Card design fetched"));
});

export {
  SaveCardDesign,
  GetCardsByEvent,
  UpdateCardDesign,
  DeleteCardDesign,
  GetSharedCard,
};
