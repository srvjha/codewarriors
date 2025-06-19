import { Router } from "express";
import {
  allUsers,
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  googleLogin,
  loginUser,
  logoutUser,
  refreshAccessToken,
  register,
  resendEmailVerification,
  resetForgottenPassword,
  verifyEmail,
} from "../controllers/auth.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyUser } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/permission.middleware";
import {
  authRateLimiter,
  forgotPasswordRateLimiter,
  resendEmailRateLimiter,
} from "../middleware/ratelimit.middleware";

const router = Router();

router.post("/register", authRateLimiter, upload.single("avatar"), register);
router.get("/verify/email/:token", verifyEmail);
router.post(
  "/resend/verify/email",
  resendEmailRateLimiter,
  verifyUser,
  resendEmailVerification
);
router.post("/login", authRateLimiter, loginUser);
router.post(
  "/password/forgot",
  forgotPasswordRateLimiter,
  resetForgottenPassword
);
router.post("/password/reset/:token", forgotPasswordRequest);
router.post(
  "/password/change",
  authRateLimiter,
  verifyUser,
  changeCurrentPassword
);
router.get("/me", verifyUser, getCurrentUser);
router.get("/refresh", refreshAccessToken);
router.get("/logout", verifyUser, logoutUser);
router.get("/all/users", verifyUser, checkRole, allUsers);
router.post("/google-auth", googleLogin);

export default router;
