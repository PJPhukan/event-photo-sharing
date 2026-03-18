import { Router } from "express";
import { VerifyJwtToken } from "../libs/auth.helpers.js";
import {
  AddFavorite,
  RemoveFavorite,
  GetFavorites,
} from "../controller/favorite.controllers.js";

const router = Router();

router.route("/").get(VerifyJwtToken, GetFavorites);
router.route("/add").post(VerifyJwtToken, AddFavorite);
router.route("/remove/:imageId").delete(VerifyJwtToken, RemoveFavorite);

export default router;
