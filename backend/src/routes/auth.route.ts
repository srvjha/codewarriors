import { Router } from "express";
import { allUsers, changeCurrentPassword, forgotPasswordRequest, getCurrentUser, loginUser, logoutUser, refreshAccessToken, register, resendEmailVerification, resetForgottenPassword, verifyEmail } from "../controllers/auth.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyUser } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/permission.middleware";

const router = Router();

router.post("/register",upload.single("avatar"),register);
router.get("/verify/email/:token",verifyEmail)
router.post("/resend/verify/email",verifyUser,resendEmailVerification);
router.post("/login", loginUser);
router.get(
  "/password/reset",
  verifyUser,
  resetForgottenPassword,
);
router.get("/password/reset/:token", verifyUser, forgotPasswordRequest);
router.get("/password/change", verifyUser, changeCurrentPassword);
router.get("/me", verifyUser, getCurrentUser);
router.get("/refresh",refreshAccessToken);
router.get("/logout", verifyUser, logoutUser);
router.get("/all/users",verifyUser,checkRole,allUsers)


export default router;