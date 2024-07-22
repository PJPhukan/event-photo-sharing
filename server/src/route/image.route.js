import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { DeleteImage, UploadImage,GetImage } from "../controller/image.controllers.js";
import { VerifyJwtToken } from "../libs/auth.helpers.js";
const router = Router();

router
  .route("/upload-image")
  .post(VerifyJwtToken, upload.array("image", 10), UploadImage); //user logged in required

router.route("/delete-image").delete(VerifyJwtToken, DeleteImage); // logged in required

router.route("/get-image").get(VerifyJwtToken, GetImage); // logged in required

export default router;
