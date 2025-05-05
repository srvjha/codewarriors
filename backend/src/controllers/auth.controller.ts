import { asyncHandler } from "../utils/asynHandler";
import { handleZodError } from "../utils/handleZodError";
import {
  validateChangePassword,
  validateEmailData,
  validateLoginData,
  validateRegisterData,
  validateResetPassword,
} from "../validators/user.validation";
import { db } from "../db";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
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

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ApiError("User not found", 400);
    }
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role:user.role
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
  const { fullName, username, email, password, role } = handleZodError(
    validateRegisterData(req.body)
  );

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError("Email already registered", 500);
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
      role,
      refreshToken: "",
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
      avatar: avatarURL,
    },
  });

  const verificationUrl = `${env.BASE_URI}/api/v1/auth/verify/email/${unHashedToken}`;

  await sendEmail(
    user.email,
    "Verify Email",
    emailVerificationMailgenContent(user.username, verificationUrl)
  );

  const {
    password: _,
    refreshToken: __,
    emailVerificationToken: ___,
    ...userInfo
  } = user;


  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userInfo,
        "User registered successfully. Please verify your email"
      )
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    throw new ApiError("Verification token is required!", 500);
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

  console.log("user: ",user)
  if (!user) {
    throw new ApiError("Invalid User or token expired", 400);
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    },
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id as string
  );
  const cookieOption = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };

  res
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = handleZodError(validateLoginData(req.body));

  const user = await db.user.findUnique({
    where: {
      email
    },
  });

  if (!user) {
    throw new ApiError("User not found", 400);
  }

  if (!user.isEmailVerified) {
    throw new ApiError("User is not verified", 400);
  }

  const verifyPassword = await isPasswordCorrect(password, user.password);

  if (!verifyPassword) {
    throw new ApiError("Invalid Credentials", 400);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id as string
  );
  const cookieOption = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
  res
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .status(200)
    .json(new ApiResponse(200, null, "User logged in Successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError("Invalid Request", 400);
  }

  const userInfo = await db.user.findUnique({
    where: { id },
  });
  if (!userInfo) {
    throw new ApiError("User not found", 400);
  }
  await db.user.update({
    where: { id },
    data: {
      refreshToken: null,
    },
  });

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
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

  if (!user) {
    throw new ApiError("User not found", 400);
  }

  if (user.isEmailVerified) {
    throw new ApiError("User already exists", 400);
  }

  const { hashedToken, tokenExpiry, unHashedToken } = generateToken();

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: tokenExpiry,
    },
  });

  const verificationUrl = `${env.BASE_URI}/api/v1/auth/verify/email/${unHashedToken}`;

  await sendEmail(
    user.email,
    "Verify Email",
    emailVerificationMailgenContent(user.username, verificationUrl)
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
          "If an account exists, a reset link has been sent to the email"
        )
      );
  }

  const { hashedToken, tokenExpiry, unHashedToken } = generateToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  const verificationUrl = `${env.BASE_URI}/api/v1/auth/password/reset/${unHashedToken}`;

  await sendEmail(
    user.email,
    "Verify Email",
    forgotPasswordMailgenContent(user.username, verificationUrl)
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
    throw new ApiError("Unauthorized Request", 400);
  }

  let decodedToken: any;
  try {
    decodedToken = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError("Invalid or expired refresh token", 400);
  }

  const user = await db.user.findUnique({
    where: { id: decodedToken._id },
  });

  if (!user) {
    throw new ApiError("Invalid Refresh Token", 400);
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError("Refresh Token Expired", 400);
  }
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user.id as string);

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
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
    throw new ApiError("Invalid User or token expired", 400);
  }
  const hashedPassword = newPassword;

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
    .json(new ApiResponse(200, null, " Password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = handleZodError(
    validateChangePassword(req.body)
  );
  const user = req.user;
  if (!oldPassword || !newPassword) {
    throw new ApiError("Missing fields required", 400);
  }

  if (!user) {
    throw new ApiError("Invalid Token or Token expired", 400);
  }

  const userInfo = await db.user.findUnique({
    where: { id: user.id },
  });
  if (!userInfo) {
    throw new ApiError("Invalid User", 400);
  }

  const oldPasswordCorrect = await isPasswordCorrect(
    oldPassword,
    userInfo.password
  );
  if (!oldPasswordCorrect) {
    throw new ApiError("Invalid old password", 400);
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
    .json(new ApiResponse(200, null, "New Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError("User ID not found in request", 400);
  }

  const userInfo = await db.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      username: true,
      email: true,
      avatar: true,
    },
  });

  if (!userInfo) {
    throw new ApiError("User not found", 400);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, userInfo, "Current User Data Fetched Successfully!")
    );
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
};
