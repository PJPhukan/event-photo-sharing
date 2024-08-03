import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  GetTotalLike,
  GetTotalEvent,
  GetTotalImages,
  GetTotalVideos,
  GetEventData,
} from "../controller/dashboard.controllers.js";
import { VerifyJwtToken } from "../libs/auth.helpers.js";
const router = Router();

router.route("/get-total-likes").get(VerifyJwtToken, GetTotalLike); //logged in required

router.route("/get-total-event").get(VerifyJwtToken, GetTotalEvent); //user logged in required

router.route("/get-total-image").get(VerifyJwtToken, GetTotalImages); //logged in required

router.route("/get-total-video").get(VerifyJwtToken, GetTotalVideos); //logged in required

router.route("/get-event-data").get(VerifyJwtToken, GetEventData); //logged in required

export default router;
