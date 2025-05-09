import { Router } from "express";
import { changeCurrentPassword, forgotPasswordRequest, getCurrentUser, getProblemsSolvedByUser, loginUser, logoutUser, refreshAccessToken, register, resetForgottenPassword, verifyEmail } from "../controllers/auth.controller";
import { upload } from "../middleware/multer.middleware";
import { verifyUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/register",upload.single("avatar"),register);
router.get("/verify/email/:token",verifyEmail)
router.get("/login", loginUser);
router.get(
  "/password/reset",
  verifyUser,
  resetForgottenPassword,
);
router.get("/password/reset/:token", verifyUser, forgotPasswordRequest);
router.get("/password/change", verifyUser, changeCurrentPassword);
router.get("/me", verifyUser, getCurrentUser);
router.get("/refresh", verifyUser, refreshAccessToken);
router.get("/logout", verifyUser, logoutUser);
router.get("/problems/solved",verifyUser,getProblemsSolvedByUser)

export default router;