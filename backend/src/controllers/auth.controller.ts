import { asyncHandler } from "../utils/asynHandler";
import { handleZodError } from "../utils/handleZodError";
import {
  validateChangePassword,
  validateEmailData,
  validateLoginData,
  validateRegisterData,
  validateResetPassword,
} from "../validators/auth.validation";
import { db } from "../db";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import {
  emailVerificationContent,
  forgotPasswordContent,
  sendEmail,
} from "../utils/sendMail";
import { ApiResponse } from "../utils/ApiResponse";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
  hashPassword,
  isPasswordCorrect,
} from "../helper/auth.helper";
import { env } from "../utils/env";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { sanitizeUser } from "../utils/sanitizeUser";
import { verifyGoogleToken } from "../utils/VerifyGoogleToken";
import { logger } from "../configs/logger";
import { cookieOptions } from "../configs/cookiesOptions";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
    const refreshToken = generateRefreshToken(user.id);

    await db.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Generate Access and Refresh Token Error: ", error);
    throw new ApiError("Internal Server Down", 500);
  }
};

const register = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = handleZodError(
    validateRegisterData(req.body)
  );

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    logger.error("Email already registered");
    throw new ApiError("Email already registered", 409);
  }

  const existingUsername = await db.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUsername) {
    logger.error("username already taken");
    throw new ApiError("username already taken", 409);
  }

  const hashedPassword = await hashPassword(password);
  const { hashedToken, tokenExpiry, unHashedToken } = generateToken();

  let avatarURL;
  const avatarLocalPath = req.file?.path;
  if (avatarLocalPath) {
    const cloudinaryResult = await uploadOnCloudinary(avatarLocalPath);
    avatarURL = cloudinaryResult?.secure_url;
  }

  const user = await db.user.create({
    data: {
      email,
      username,
      fullName,
      password: hashedPassword,
      role: UserRole.USER,
      refreshToken: "",
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
      avatar: avatarURL,
    },
  });
  const verificationUrl = `${env.BASE_URI}/verify/${unHashedToken}`;

  await sendEmail(
    user.email,
    "Verify Email",
    emailVerificationContent(user.username, verificationUrl)
  );

  const {
    password: _,
    refreshToken: __,
    emailVerificationToken: ___,
    ...userInfo
  } = user;

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id as string
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        userInfo,
        "User registered successfully. Please verify your email"
      )
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    logger.error("Verification token is required");
    throw new ApiError("Verification token is required!", 400);
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await db.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: {
        gt: new Date(),
      },
    },
  });
  if (!user) {
    logger.error("Invalid User or token expired");
    throw new ApiError("Invalid User or token expired", 401);
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = handleZodError(validateLoginData(req.body));

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    logger.error("User not found");
    throw new ApiError("User not found", 404);
  }
  const verifyPassword = await isPasswordCorrect(password, user.password);

  if (!verifyPassword) {
    logger.error("Invalid Credentials");
    throw new ApiError("Invalid Credentials", 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id as string
  );

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(200, sanitizeUser(user), "User logged in Successfully")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    logger.error("Invalid Request: User ID is required for logout");
    throw new ApiError("Invalid Request", 400);
  }

  const userInfo = await db.user.findUnique({
    where: { id },
  });
  if (!userInfo) {
    logger.error("User not found");
    throw new ApiError("User not found", 404);
  }
  await db.user.update({
    where: { id },
    data: {
      refreshToken: null,
    },
  });

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, "User Logged Out Successfully"));
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = handleZodError(validateEmailData(req.body));
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.isEmailVerified) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Verification link sent successfully. Check Inbox"
        )
      );
  }

  const { hashedToken, tokenExpiry, unHashedToken } = generateToken();

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
    },
  });

  const verificationUrl = `${env.BASE_URI}/verify/${unHashedToken}`;

  await sendEmail(
    user.email,
    "Verify Email",
    emailVerificationContent(user.username, verificationUrl)
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Verification link sent successfully. Check Inbox"
      )
    );
});

const resetForgottenPassword = asyncHandler(async (req, res) => {
  const { email } = handleZodError(validateEmailData(req.body));

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Reset password link sent successfully. Check Inbox"
        )
      );
  }

  const { hashedToken, tokenExpiry, unHashedToken } = generateToken();

  await db.user.update({
    where: { id: user.id },
    data: {
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: tokenExpiry,
    },
  });

  const verificationUrl = `${env.BASE_URI}/forgot/password/${unHashedToken}`;

  await sendEmail(
    user.email,
    "Verify Email",
    forgotPasswordContent(user.username, verificationUrl)
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Reset password link sent successfully. Check Inbox"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    logger.error("Unauthorized Request: Refresh token is required");
    throw new ApiError("Unauthorized Request", 401);
  }

  let decodedToken: any;
  try {
    decodedToken = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    logger.error("Invalid or expired refresh token");
    throw new ApiError("Invalid or expired refresh token", 401);
  }

  const user = await db.user.findUnique({
    where: { id: decodedToken.id },
  });

  if (!user) {
    logger.error("Invalid Refresh Token: User not found");
    throw new ApiError("Invalid Refresh Token", 401);
  }

  if (incomingRefreshToken !== user.refreshToken) {
    logger.error("Refresh Token Expired");
    throw new ApiError("Refresh Token Expired", 401);
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user.id as string);

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new ApiResponse(200, null, "Token Refreshed Successfully"));
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = handleZodError(validateResetPassword(req.body));

  if (!token) {
    throw new ApiError("token required", 400);
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await db.user.findFirst({
    where: {
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    logger.error("Invalid User or token expired");
    throw new ApiError("Invalid User or token expired", 401);
  }
  const hashedPassword = await hashPassword(newPassword);

  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      forgotPasswordToken: null,
      forgotPasswordExpiry: null,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = handleZodError(
    validateChangePassword(req.body)
  );

  const user = req.user;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new ApiError("Missing fields required", 400);
  }

  if (newPassword !== confirmNewPassword) {
    throw new ApiError("New password and confirm password do not match", 400);
  }

  if (!user) {
    logger.error("Unauthorized Request: User not authenticated");
    throw new ApiError("Invalid Token or Token expired", 401);
  }

  const userInfo = await db.user.findUnique({
    where: { id: user.id },
  });
  if (!userInfo) {
    logger.error("User not found");
    throw new ApiError("user not found", 404);
  }

  const oldPasswordCorrect = await isPasswordCorrect(
    oldPassword,
    userInfo.password
  );
  if (!oldPasswordCorrect) {
    logger.error("Invalid old password");
    throw new ApiError("Invalid old password", 401);
  }

  const hashedPassword = await hashPassword(newPassword);

  await db.user.update({
    where: { id: userInfo.id },
    data: {
      password: hashedPassword,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    logger.error("Unauthorized Request: User not authenticated");
    throw new ApiError("User not authenticated", 401);
  }

  const userInfo = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      avatar: true,
      isEmailVerified: true,
      role: true,
      dailyProblemStreak: true,
    },
  });

  if (!userInfo) {
    throw new ApiError("User not found", 401);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, userInfo, "Current User Data Fetched Successfully!")
    );
});

const allUsers = asyncHandler(async (req, res) => {
  const getUsers = await db.user.findMany({
    select: {
      id: true,
      fullName: true,
      username: true,
      avatar: true,
      email: true,
      isEmailVerified: true,
      isStreakMaintained: true,
      lastSubmissionDate: true,
      dailyProblemStreak: true,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, getUsers, "All users fetched successfully"));
});

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  const payload = await verifyGoogleToken(credential);

  const { email, name, picture, email_verified } = payload;
  if (!email || !name || !picture || !email_verified) {
    throw new ApiError("Missing required Fields", 400);
  }

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  let user = existingUser;
  // if no user found then we will create new user

  if (!user) {
    const baseUsername = email.split("@")[0];
    let username = baseUsername;
    const existing = await db.user.findUnique({ where: { username } });
    if (existing) {
      username = `${baseUsername}_${crypto.randomUUID().slice(0, 6)}`;
    }
    user = await db.user.create({
      data: {
        email,
        fullName: name,
        isEmailVerified: email_verified,
        avatar: picture,
        username,
        provider: "google",
      },
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id as string
  );

  logger.info(`${email} logged in via Google`);

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, null, "Google login successful"));
});

export {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  register,
  resendEmailVerification,
  resetForgottenPassword,
  verifyEmail,
  allUsers,
  googleLogin,
};
