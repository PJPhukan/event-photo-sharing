import { Router } from "express";
import {
  DeleteCardDesign,
  GetCardsByEvent,
  GetSharedCard,
  SaveCardDesign,
  UpdateCardDesign,
} from "../controller/cardDesign.controllers.js";
import { VerifyJwtToken } from "../libs/auth.helpers.js";

const router = Router();

router.route("/save").post(VerifyJwtToken, SaveCardDesign);
router.route("/share/:cardId").get(GetSharedCard);
router.route("/:eventId").get(VerifyJwtToken, GetCardsByEvent);
router.route("/:cardId").put(VerifyJwtToken, UpdateCardDesign);
router.route("/:cardId").delete(VerifyJwtToken, DeleteCardDesign);

export default router;
