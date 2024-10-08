import { Router } from "express";
import {
  logInUser,
  logOutUser,
  registerUser,
  updateRefreshToken,
  updateUserProfilePicture,
} from "../controllers/user.controller";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(logInUser);

router.route("/logout").post(verifyAccessToken, logOutUser);

router.route("/refreshToken").post(updateRefreshToken);

router
  .route("/update/profile")
  .post(
    verifyAccessToken,
    upload.single("profileImg"),
    updateUserProfilePicture
  );

router.route("/update/user").post(verifyAccessToken, updateUserProfilePicture);

export default router;
