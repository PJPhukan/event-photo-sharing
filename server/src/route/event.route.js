import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  CreateEvent,
  DeleteEvent,
  EditEvent,
  GetAllEvent
} from "../controller/event.controllers.js";
import { VerifyJwtToken } from "../libs/auth.helpers.js";
const router = Router();

router.route("/create-event").post(VerifyJwtToken, CreateEvent); //logged in required

router.route("/delete-event").delete(VerifyJwtToken, DeleteEvent); //user logged in required

router.route("/edit-event").patch(VerifyJwtToken, EditEvent); //logged in required

router.route("/get-events").get(VerifyJwtToken, GetAllEvent); //logged in required



export default router;
