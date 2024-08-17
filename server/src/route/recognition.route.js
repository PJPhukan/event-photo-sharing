import { Router } from "express";

import {
  GetDetails,
  UserLike,
  UserDislike,
} from "../controller/recognition.controller.js";
import { VerifyJwtToken } from "../libs/auth.helpers.js";

const router = Router();

router.route("/get-details/:userId/:eventId").get(GetDetails);

router.route("/like-image").post(VerifyJwtToken, UserLike);

router.route("/dislike-image/:imageId").patch(VerifyJwtToken, UserDislike);



export default router;
