import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  RegisterUser,
  GerUserDetails,
  Login,
  Logout,
  ChangePassword,
  ChangeMobileNumber,
  ChangeAvater,
  ChangeCoverImage,
  ForgotPassword,
  VerifyOTP,
  ResetPassword,
  UpdateUserDetails,
  CheckCookie,
  ChangeEmail,
  DeleteAccount,
} from "../controller/user.conrollers.js";
import { VerifyJwtToken } from "../libs/auth.helpers.js";
const router = Router();

router.route("/register").post(RegisterUser); //No logged in required

router.route("/getdetails").get(VerifyJwtToken, GerUserDetails); //user logged in required

router.route("/login").post(Login); //no logged in required

router.route("/logout").post(VerifyJwtToken, Logout); //user logged in required

router.route("/updateuser").patch(VerifyJwtToken, UpdateUserDetails); //user logged in required

router.route("/check-cookie").get(CheckCookie); //no logged in required

router.route("/changepassword").patch(VerifyJwtToken, ChangePassword); //user logged in required

router.route("/changeemail").patch(VerifyJwtToken, ChangeEmail); //user logged in required

router.route("/changemobilenumber").patch(VerifyJwtToken, ChangeMobileNumber); //user logged in required

router
  .route("/changeavater")
  .patch(VerifyJwtToken, upload.single("avatar"), ChangeAvater); //user logged in required

router
  .route("/changecoverimage")
  .patch(VerifyJwtToken, upload.single("coverImg"), ChangeCoverImage); //user logged in required

router.route("/forgotpassword").post(ForgotPassword); //no logged in required

router.route("/verifyotp").post(VerifyOTP); //no logged in required

router.route("/resetpassword").patch(ResetPassword); //no logged in required

router.route("/deleteaccount").delete(VerifyJwtToken, DeleteAccount); // logged in required

export default router;
