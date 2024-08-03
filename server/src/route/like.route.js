import { Router } from "express";
import { NewLike, DeleteLike } from "../controller/like.controllers.js";
import { VerifyJwtToken } from "../libs/auth.helpers.js";
const router = Router();

router.route("/like-post").post(VerifyJwtToken, NewLike); //user logged in required

router.route("/unlike-post/:imageId").delete(VerifyJwtToken, DeleteLike); //user logged in required

export default router;
