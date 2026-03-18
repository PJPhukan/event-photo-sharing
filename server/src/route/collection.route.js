import { Router } from "express";
import { VerifyJwtToken } from "../libs/auth.helpers.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  CreateCollection,
  GetCollections,
  GetCollection,
  UpdateCollection,
  AddImageToCollection,
  RemoveImageFromCollection,
  DeleteCollection,
} from "../controller/collection.controllers.js";

const router = Router();

router.route("/").get(VerifyJwtToken, GetCollections);
router
  .route("/create")
  .post(VerifyJwtToken, upload.single("coverImage"), CreateCollection);
router.route("/:collectionId").get(VerifyJwtToken, GetCollection);
router
  .route("/:collectionId")
  .patch(VerifyJwtToken, upload.single("coverImage"), UpdateCollection);
router
  .route("/:collectionId/add-image")
  .post(VerifyJwtToken, AddImageToCollection);
router
  .route("/:collectionId/remove-image/:imageId")
  .delete(VerifyJwtToken, RemoveImageFromCollection);
router.route("/:collectionId").delete(VerifyJwtToken, DeleteCollection);

export default router;
