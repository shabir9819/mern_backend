import express from "express";
// import endpoints from "../../../config/endpoints.js";
import endpoints from "../../../../config/endpoints.js";
import {
  loginUser,
  registerUser,
  verifyOtp,
} from "../controllers/userControllers.js";
import Users from "../models/users.js";
import {
  generateToken,
  isAuthenticateSession,
} from "../controllers/sessionControllers.js";
import { saveFcm } from "../controllers/fcmControllers.js";

const { save_fcm, register, login, verify_otp } = endpoints;

const router = express.Router();

router.post(`${save_fcm}`, saveFcm);
router.post(`${register}`, registerUser);
router.post(`${login}`, loginUser);
router.post(`${verify_otp}`, verifyOtp);

export default router;
