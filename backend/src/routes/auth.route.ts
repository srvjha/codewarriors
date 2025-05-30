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
import { getTimeComplexity } from "../controllers/ai.controller";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.get("/verify/email/:token", verifyEmail);
router.post("/resend/verify/email", verifyUser, resendEmailVerification);
router.post("/login", loginUser);
router.post("/password/forgot", verifyUser, resetForgottenPassword);
router.get("/password/reset/:token", verifyUser, forgotPasswordRequest);
router.post("/password/change", verifyUser, changeCurrentPassword);
router.get("/me", verifyUser, getCurrentUser);
router.get("/refresh", refreshAccessToken);
router.get("/logout", verifyUser, logoutUser);
router.get("/all/users", verifyUser, checkRole, allUsers);
router.post("/google-auth",googleLogin)
router.post("/get-complexity",getTimeComplexity)

export default router;
