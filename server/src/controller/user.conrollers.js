import { User } from "../model/user.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  GenerateHashedPassword,
  encodeAuthToken,
} from "../libs/auth.helpers.js";
/**
 //TODO : 

 * register user
 * login user
 * change password
 * forgot password
 * verify password
 * new password
 * change cover image
 * change avater image 
 * logout
 */

const RegisterUser = AsyncHandler(async (req, res) => {
  const { username, fullname, email, password, phoneNumber } = req.body;

  if (
    [username, fullname, email, password, phoneNumber].some(
      (item) => item?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All field are required");
  }

  let user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (user) {
    throw new ApiError(409, "User Already exist");
  }

  const securePassword = GenerateHashedPassword(password);

  user = await User.create({
    username,
    fullname,
    email,
    password: securePassword,
    phoneNumber,
  })?.select("-password");
  if (!user) {
    throw new ApiError(500, "Internal server error !!");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  const token = encodeAuthToken(payload);

  return res
    .status(200)
    .cookie("authToken", token, options)
    .json(
      new ApiResponse(200, { user, token }, "User successfully registered")
    );
});

const GerUserDetails = AsyncHandler(async (req, res) => {
  //get user details body
});

const Login = AsyncHandler(async (req, res) => {
  //login body
});

const Logout = AsyncHandler(async (req, res) => {
  //logout body
});

const ChangePassword = AsyncHandler(async (req, res) => {
  //change password body
});

const ChangeMobileNumber = AsyncHandler(async (req, res) => {
  //change mobilenumber body
});

const ChangeAvater = AsyncHandler(async (req, res) => {
  //change avater body
});

const ChangeCoverImage = AsyncHandler(async (req, res) => {
  //change cover image body
});

const ForgotPassword = AsyncHandler(async (req, res) => {
  //forgot password
});

const VerifyUser = AsyncHandler(async (req, res) => {
  //verify user password
});

const ResetPassword = AsyncHandler(async (req, res) => {
  //reset user password
});

export {
  RegisterUser,
  GerUserDetails,
  Login,
  Logout,
  ChangePassword,
  ChangeMobileNumber,
  ChangeAvater,
  ChangeCoverImage,
  ForgotPassword,
  VerifyUser,
  ResetPassword,
};
