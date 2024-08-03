import { User } from "../model/user.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  GenerateHashedPassword,
  encodeAuthToken,
  CompareHashedPassword,
} from "../libs/auth.helpers.js";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { transporter } from "../libs/transporter.js";
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

let VerificationOtp = null;

const RegisterUser = AsyncHandler(async (req, res) => {
  const { username, fullname, email, password, phoneNumber } = req.body;

  if (!username && !fullname && !email && !password && !phoneNumber) {
    throw new ApiError(400, "All field are required");
  }

  let user = await User.findOne({ $or: [{ email }, { username }] });

  if (user) {
    throw new ApiError(409, "User Already exist");
  }

  const securePassword = await GenerateHashedPassword(password);

  user = await User.create({
    username,
    fullname,
    email,
    password: securePassword,
    phoneNumber,
    coverImage: null,
  });

  user = await User.findById(user._id).select("-password");

  if (!user) {
    throw new ApiError(500, "Internal server error !!");
  }
  const options = {
    httpOnly: true,
    secure:true, // Secure in production
    sameSite: "Strict", // Helps protect against CSRF attacks
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
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
  const { _id } = req.user;

  if (!_id) {
    throw new ApiError(409, "Please Authenticate  with a valid user !");
  }
  const user = await User.findById(_id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found !");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user }, "Successfully user details fatched !")
    );
});

const Login = AsyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    throw new ApiError(400, "username and password are required !");
  }
  let user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "Please authenticate with valid credentials");
  }

  const checkPassword = await CompareHashedPassword(password, user.password);
  if (!checkPassword) {
    throw new ApiError(401, "Incorrect password");
  }

  user.password = undefined;

  const options = {
    httpOnly: false,
    secure: false, // Secure in production
    sameSite: "Strict", // Helps protect against CSRF attacks
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
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
    .json(new ApiResponse(200, { user, token }, "User successfully logged in"));
});

const Logout = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(401, "User Unauthorized !");
  }
  const options = {
    httpOnly: false,
    secure: false, // Secure in production
    sameSite: "Strict", // Helps protect against CSRF attacks
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  };
  return res
    .status(200)
    .clearCookie("authToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const UpdateUserDetails = AsyncHandler(async (req, res) => {
  const { eusername, ename, ebio, emobile } = req.body;

  const UpdateUser = {};

  if (eusername) UpdateUser.username = eusername;
  if (ename) UpdateUser.fullname = ename;
  if (ebio) UpdateUser.bio = ebio;
  if (emobile) UpdateUser.phoneNumber = emobile;

  let user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found !");
  }

  user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: UpdateUser },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(
      500,
      "Internal server error occured while updating user details !"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Successfully user details updated !"));
});

const ChangePassword = AsyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  let user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(401, "Plase authenticate with a valid user credentials");
  }

  const checkPassword = await CompareHashedPassword(oldPassword, user.password);
  if (!checkPassword) {
    throw new ApiError(401, "Old password is incorrect !");
  }
  user = await User.findOneAndUpdate(req.user._id, {
    $set: {
      password: newPassword,
    },
  }).select("-password");

  // or

  // user.password = newPassword;
  // await user.save({
  //   validateBeforeSave: false,
  // });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully !"));
});

const ChangeEmail = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(401, "Plase authenticate with a valid user credentials");
  }

  const checkPassword = await CompareHashedPassword(password, user.password);
  if (!checkPassword) {
    throw new ApiError(401, "Password is incorrect !");
  }
  user = await User.findOneAndUpdate(req.user._id, {
    $set: {
      email,
    },
  }).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User email changed successfully !"));
});

const ChangeMobileNumber = AsyncHandler(async (req, res) => {
  const { newNumber, oldNumber } = req.body;
  if (!newNumber && !oldNumber) {
    throw new ApiError(400, "All fields are required !");
  }
  let user = await User.findById(req.user._id)?.select("-password");
  if (!user) throw new ApiError(404, "User not found !");
  user.phoneNumber = newNumber;

  user = await user.save({ validateBeforeSave: false });
  console.log("189 : ", user);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Phone number changed successfully"));
});

const ChangeAvater = AsyncHandler(async (req, res) => {
  const localAvatarPath = req.file?.path;
  if (!localAvatarPath) {
    throw new ApiError(400, "Please select an valid avatar");
  }
  const cloudinaryUrl = await cloudinaryUpload(localAvatarPath);
  if (!cloudinaryUrl.url) {
    throw new ApiError(500, "Error occured while updating avatar image ");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      avatar: cloudinaryUrl.url,
    },
  })?.select("-password");
  if (!user) {
    throw new ApiError(500, "Error occured while updating avater ");
  }
  return res.status(200).json(200, user, "Avatar change successfully");
});

const ChangeCoverImage = AsyncHandler(async (req, res) => {
  const localCoverPath = req.file?.path;
  if (!localCoverPath)
    throw new ApiError(400, "Please select a valid cover image");

  const cloudinaryCoverUrl = await cloudinaryUpload(localCoverPath);
  if (!cloudinaryCoverUrl.url)
    throw new ApiError(
      500,
      "Error occured while uploading image to the cloudinary "
    );
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      coverImage: cloudinaryCoverUrl.url,
    },
  })?.select("-password");

  if (!user) {
    throw new ApiError(500, " Error occured while updating cover image ");
  }
  return res.status(200).json(200, user, "Cover image update successfully");
});

const CheckCookie = AsyncHandler(async (req, res) => {
  const token = req.cookies?.authToken;
  return res
    .status(200)
    .json(new ApiResponse(200, { token }, "Token fetched successfully !"));
});
//TODO:-> Using link
let Useremail = null;
const ForgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne(email);
  if (!user) {
    throw new ApiError(400, "User is not found !");
  }
  VerificationOtp = Math.round(100000 + (999999 - 100000) * Math.random());

  const mailOptions = {
    from: process.env.PRODUCTION_EMAIL,
    to: email,
    subject: "Password Reset OTP for Your Account\n",

    text: `We have received a request to reset the password for your account associated with Memois\n\n\n Your Varification Code :${VerificationOtp} . 
    ${Link}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(500, error.message || "Error while sending otp");
  }
  Useremail = email;
  return res.status(200).json(200, otp, "OTP send successfully");
});

const VerifyOTP = AsyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (otp !== VerificationOtp) {
    throw new ApiError(401, "Invalid Varification code ");
  }

  return res.status(200).json(200, "OTP Verification successfully");
});

const ResetPassword = AsyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  const secPassword = await GenerateHashedPassword(newPassword);

  let user = await User.findOneAndUpdate(Useremail, {
    $set: {
      password: secPassword,
    },
  })?.select("-password");
  if (!user) {
    throw new ApiError(500, "Error occured while changing password");
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
      new ApiResponse(200, { user, token }, "User password change successfully")
    );
});

const DeleteAccount = AsyncHandler(async (req, res) => {
  let user = await User.findById(req.user._id);
  if (!user)
    throw new ApiError(404, "Please Authenticate with valid credentials !");

  const checkDeleted = await user.deleteOne();
  if (checkDeleted) {
    return res
      .status(200)
      .json(new ApiResponse(200, "User Successfully deleted"));
  } else {
    throw new ApiError(500, "Error Occured while deleting Account");
  }
});

const GetUserId = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, { id: req.user._id }, "User id send successfully")
    );
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
  VerifyOTP,
  ResetPassword,
  UpdateUserDetails,
  CheckCookie,
  ChangeEmail,
  DeleteAccount,
  GetUserId,
};
