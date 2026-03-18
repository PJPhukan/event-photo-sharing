import { User } from "../model/user.model.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  GenerateHashedPassword,
  encodeAuthToken,
  CompareHashedPassword,
} from "../libs/auth.helpers.js";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { cloudinaryUpload } from "../utils/cloudinary.js";
import { transporter } from "../libs/transporter.js";
import { Notification } from "../model/notification.model.js";
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

const buildCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    // Railway + Vercel deployments need cross-site cookies in production.
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
};

const resetOtpStore = new Map();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9._]{3,20}$/;
const phonePattern = /^\d{10,15}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const normalizeEmail = (value = "") => value.trim().toLowerCase();
const normalizeUsername = (value = "") => value.trim().toLowerCase();
const generateBackupCodes = (count = 8) =>
  Array.from({ length: count }, () =>
    Math.random().toString().slice(2, 12).padEnd(10, "0")
  );

const buildBackupCodeEntries = async (codes) => {
  const entries = [];
  for (const code of codes) {
    const codeHash = await GenerateHashedPassword(code);
    entries.push({ codeHash, used: false });
  }
  return entries;
};

const verifyBackupCode = async (user, rawCode = "") => {
  if (!rawCode) return { valid: false };
  const code = rawCode.trim();
  if (!code || !Array.isArray(user.twoFactorBackupCodes)) {
    return { valid: false };
  }
  for (const entry of user.twoFactorBackupCodes) {
    if (entry.used) continue;
    const match = await CompareHashedPassword(code, entry.codeHash);
    if (match) {
      entry.used = true;
      return { valid: true };
    }
  }
  return { valid: false };
};

const createTwoFactorToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10m" });

const assertValidPassword = (password) => {
  if (!passwordPattern.test(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters and include letters and numbers"
    );
  }
};

const RegisterUser = AsyncHandler(async (req, res) => {
  const { username, fullname, email, password, phoneNumber } = req.body;
  const normalizedUsername = normalizeUsername(username);
  const normalizedEmail = normalizeEmail(email);
  const normalizedFullname = fullname?.trim();
  const normalizedPhoneNumber = `${phoneNumber ?? ""}`.trim();

  if (
    !normalizedUsername ||
    !normalizedFullname ||
    !normalizedEmail ||
    !password ||
    !normalizedPhoneNumber
  ) {
    throw new ApiError(400, "All field are required");
  }

  if (!usernamePattern.test(normalizedUsername)) {
    throw new ApiError(
      400,
      "Username must be 3-20 characters and use only letters, numbers, dots or underscores"
    );
  }

  if (!emailPattern.test(normalizedEmail)) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  if (!phonePattern.test(normalizedPhoneNumber)) {
    throw new ApiError(400, "Please enter a valid phone number");
  }

  assertValidPassword(password);

  let user = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (user) {
    throw new ApiError(409, "User Already exist");
  }

  const securePassword = await GenerateHashedPassword(password);

  user = await User.create({
    username: normalizedUsername,
    fullname: normalizedFullname,
    email: normalizedEmail,
    password: securePassword,
    phoneNumber: Number(normalizedPhoneNumber),
    coverImage: null,
  });

  user = await User.findById(user._id).select("-password");

  if (!user) {
    throw new ApiError(500, "Internal server error !!");
  }
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  //Add congratulation message to user
  const RegisterNotification = await Notification.create({
    message: "Welcome! Your account has been created successfully.",
    owner_id: user._id,
    imageId: null,
    username: null,
    type: "signup",
    avatar: user.avatar,
  });

  const token = encodeAuthToken(payload);

  return res
    .status(200)
    .cookie("authToken", token, buildCookieOptions())
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
  const identifier = `${username ?? ""}`.trim();

  if (!identifier || !password) {
    throw new ApiError(400, "username and password are required !");
  }

  const loginQuery = emailPattern.test(identifier)
    ? { email: normalizeEmail(identifier) }
    : { username: normalizeUsername(identifier) };

  let user = await User.findOne(loginQuery);

  if (!user) {
    throw new ApiError(404, "Please authenticate with valid credentials");
  }

  const checkPassword = await CompareHashedPassword(password, user.password);
  if (!checkPassword) {
    throw new ApiError(401, "Incorrect password");
  }

  user.password = undefined;

  if (user.twoFactorEnabled) {
    const twoFactorToken = createTwoFactorToken({
      _id: user._id,
      type: "2fa",
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          requiresTwoFactor: true,
          twoFactorToken,
          userId: user._id,
        },
        "Two-factor authentication required"
      )
    );
  }

  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  //Add congratulation message to user
  await Notification.create({
    message: "Login successful! Let’s get started.",
    owner_id: user._id,
    imageId: null,
    username: null,
    type: "login",
    avatar: user.avatar,
  });

  const token = encodeAuthToken(payload);

  return res
    .status(200)
    .cookie("authToken", token, buildCookieOptions())
    .json(new ApiResponse(200, { user, token }, "User successfully logged in"));
});

const LoginWithTwoFactor = AsyncHandler(async (req, res) => {
  const { twoFactorToken, token, backupCode } = req.body;

  if (!twoFactorToken) {
    throw new ApiError(400, "Two-factor token is required");
  }

  let decoded;
  try {
    decoded = jwt.verify(twoFactorToken, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Two-factor session expired. Please login again.");
  }

  if (!decoded || decoded.type !== "2fa") {
    throw new ApiError(401, "Invalid two-factor session");
  }

  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new ApiError(409, "Two-factor authentication is not enabled");
  }

  let verified = false;
  let usedBackupCode = false;

  if (token) {
    const verification = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: String(token).trim(),
      window: 1,
    });
    if (verification) {
      const currentStep = speakeasy.totp.timeUsed();
      if (user.twoFactorLastUsedStep === currentStep) {
        throw new ApiError(409, "This code was already used");
      }
      user.twoFactorLastUsedStep = currentStep;
      verified = true;
    }
  }

  if (!verified && backupCode) {
    const backupResult = await verifyBackupCode(user, backupCode);
    if (backupResult.valid) {
      verified = true;
      usedBackupCode = true;
    }
  }

  if (!verified) {
    throw new ApiError(401, "Invalid verification code");
  }

  await user.save();

  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  const authToken = encodeAuthToken(payload);

  return res
    .status(200)
    .cookie("authToken", authToken, buildCookieOptions())
    .json(
      new ApiResponse(
        200,
        { user, token: authToken, usedBackupCode },
        "Two-factor verification successful"
      )
    );
});

const Logout = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(401, "User Unauthorized !");
  }
  return res
    .status(200)
    .clearCookie("authToken", buildCookieOptions())
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const GetTwoFactorStatus = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        enabled: Boolean(user.twoFactorEnabled),
        pending: Boolean(user.twoFactorTempSecret && !user.twoFactorEnabled),
      },
      "Two-factor status fetched"
    )
  );
});

const SetupTwoFactor = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const secret = speakeasy.generateSecret({
    name: `Memois (${user.email})`,
    length: 20,
  });

  user.twoFactorTempSecret = secret.base32;
  await user.save();

  const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        otpauthUrl: secret.otpauth_url,
        qrCodeDataUrl,
        secret: secret.base32,
      },
      "Two-factor setup generated"
    )
  );
});

const VerifyTwoFactor = AsyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    throw new ApiError(400, "Verification code is required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.twoFactorTempSecret) {
    throw new ApiError(409, "No pending two-factor setup");
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorTempSecret,
    encoding: "base32",
    token: String(token).trim(),
    window: 1,
  });

  if (!verified) {
    throw new ApiError(401, "Invalid verification code");
  }

  user.twoFactorSecret = user.twoFactorTempSecret;
  user.twoFactorTempSecret = null;
  user.twoFactorEnabled = true;
  user.twoFactorLastUsedStep = speakeasy.totp.timeUsed();

  const backupCodes = generateBackupCodes(8);
  user.twoFactorBackupCodes = await buildBackupCodeEntries(backupCodes);
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { backupCodes },
      "Two-factor authentication enabled"
    )
  );
});

const DisableTwoFactor = AsyncHandler(async (req, res) => {
  const { token, backupCode } = req.body;
  if (!token && !backupCode) {
    throw new ApiError(400, "Verification code is required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new ApiError(409, "Two-factor authentication is not enabled");
  }

  let verified = false;
  if (token) {
    verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: String(token).trim(),
      window: 1,
    });
  }

  if (!verified && backupCode) {
    const backupResult = await verifyBackupCode(user, backupCode);
    verified = backupResult.valid;
  }

  if (!verified) {
    throw new ApiError(401, "Invalid verification code");
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = null;
  user.twoFactorTempSecret = null;
  user.twoFactorBackupCodes = [];
  user.twoFactorLastUsedStep = null;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Two-factor authentication disabled"));
});

const UpdateUserDetails = AsyncHandler(async (req, res) => {
  const { eusername, ename, ebio, emobile } = req.body;

  const UpdateUser = {};

  if (eusername) {
    const normalizedUsername = normalizeUsername(eusername);
    if (!usernamePattern.test(normalizedUsername)) {
      throw new ApiError(
        400,
        "Username must be 3-20 characters and use only letters, numbers, dots or underscores"
      );
    }
    const existingUser = await User.findOne({
      username: normalizedUsername,
      _id: { $ne: req.user._id },
    });
    if (existingUser) {
      throw new ApiError(409, "Username already in use");
    }
    UpdateUser.username = normalizedUsername;
  }
  if (ename) {
    const normalizedFullname = ename.trim();
    if (!normalizedFullname) {
      throw new ApiError(400, "Full name is required");
    }
    UpdateUser.fullname = normalizedFullname;
  }
  if (ebio) UpdateUser.bio = ebio;
  if (emobile) {
    const normalizedPhoneNumber = `${emobile}`.trim();
    if (!phonePattern.test(normalizedPhoneNumber)) {
      throw new ApiError(400, "Please enter a valid phone number");
    }
    UpdateUser.phoneNumber = Number(normalizedPhoneNumber);
  }

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
  if (!newPassword || !oldPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  let user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(401, "Plase authenticate with a valid user credentials");
  }

  const checkPassword = await CompareHashedPassword(oldPassword, user.password);
  if (!checkPassword) {
    throw new ApiError(401, "Old password is incorrect !");
  }
  assertValidPassword(newPassword);
  const hashedPassword = await GenerateHashedPassword(newPassword);

  user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      password: hashedPassword,
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
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const normalizedEmail = normalizeEmail(email);
  if (!emailPattern.test(normalizedEmail)) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  let user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(401, "Plase authenticate with a valid user credentials");
  }

  const checkPassword = await CompareHashedPassword(password, user.password);
  if (!checkPassword) {
    throw new ApiError(401, "Password is incorrect !");
  }
  const existingUser = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: req.user._id },
  });
  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }
  user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email: normalizedEmail,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User email changed successfully !"));
});

const ChangeMobileNumber = AsyncHandler(async (req, res) => {
  const { newNumber, oldNumber } = req.body;
  if (!newNumber || !oldNumber) {
    throw new ApiError(400, "All fields are required !");
  }
  const normalizedNewNumber = `${newNumber}`.trim();
  if (!phonePattern.test(normalizedNewNumber)) {
    throw new ApiError(400, "Please enter a valid phone number");
  }
  let user = await User.findById(req.user._id)?.select("-password");
  if (!user) throw new ApiError(404, "User not found !");
  if (`${user.phoneNumber}` !== `${oldNumber}`) {
    throw new ApiError(400, "Old phone number does not match");
  }
  user.phoneNumber = Number(normalizedNewNumber);

  user = await user.save({ validateBeforeSave: false });

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
  if (!cloudinaryUrl?.url) {
    throw new ApiError(500, "Error occured while updating avatar image ");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      avatar: cloudinaryUrl.url,
    },
  }, { new: true })?.select("-password");
  if (!user) {
    throw new ApiError(500, "Error occured while updating avater ");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Avatar changed successfully"));
});

const ChangeCoverImage = AsyncHandler(async (req, res) => {
  const localCoverPath = req.file?.path;
  if (!localCoverPath)
    throw new ApiError(400, "Please select a valid cover image");

  const cloudinaryCoverUrl = await cloudinaryUpload(localCoverPath);
  if (!cloudinaryCoverUrl?.url)
    throw new ApiError(
      500,
      "Error occured while uploading image to the cloudinary "
    );
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      coverImage: cloudinaryCoverUrl.url,
    },
  }, { new: true })?.select("-password");

  if (!user) {
    throw new ApiError(500, " Error occured while updating cover image ");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Cover image updated successfully"));
});

const CheckCookie = AsyncHandler(async (req, res) => {
  const token =
    req.cookies?.authToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  return res
    .status(200)
    .json(new ApiResponse(200, { token }, "Token fetched successfully !"));
});
const ForgotPassword = AsyncHandler(async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body.email);
  if (!normalizedEmail) {
    throw new ApiError(400, "Email is required");
  }

  if (!emailPattern.test(normalizedEmail)) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  let user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(400, "User is not found !");
  }
  const verificationOtp = Math.floor(100000 + Math.random() * 900000).toString();
  resetOtpStore.set(normalizedEmail, {
    otp: verificationOtp,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: normalizedEmail,
    subject: "Password Reset OTP for Your Account\n",

    text: `We received a request to reset your Memois password.\n\nVerification code: ${verificationOtp}\nThis code expires in 10 minutes.`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(500, error.message || "Error while sending otp");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

const VerifyOTP = AsyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = `${req.body.otp ?? ""}`.trim();
  const resetRequest = resetOtpStore.get(email);

  if (!email || !otp) {
    throw new ApiError(400, "Email and otp are required");
  }

  if (!resetRequest || !otp || Date.now() > resetRequest.expiresAt) {
    throw new ApiError(401, "Verification code expired or invalid");
  }

  if (`${otp}` !== `${resetRequest.otp}`) {
    throw new ApiError(401, "Invalid Varification code ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP verified successfully"));
});

const ResetPassword = AsyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = `${req.body.otp ?? ""}`.trim();
  const { newPassword } = req.body;
  const resetRequest = resetOtpStore.get(email);

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, otp and newPassword are required");
  }

  if (!resetRequest || Date.now() > resetRequest.expiresAt) {
    throw new ApiError(401, "Verification code expired or invalid");
  }

  if (`${otp}` !== `${resetRequest.otp}`) {
    throw new ApiError(401, "Invalid verification code");
  }

  assertValidPassword(newPassword);

  const secPassword = await GenerateHashedPassword(newPassword);

  let user = await User.findOneAndUpdate({ email }, {
    $set: {
      password: secPassword,
    },
  }, { new: true })?.select("-password");
  if (!user) {
    throw new ApiError(500, "Error occured while changing password");
  }

  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  const token = encodeAuthToken(payload);
  resetOtpStore.delete(email);

  return res
    .status(200)
    .cookie("authToken", token, buildCookieOptions())
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
  LoginWithTwoFactor,
  Logout,
  GetTwoFactorStatus,
  SetupTwoFactor,
  VerifyTwoFactor,
  DisableTwoFactor,
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
