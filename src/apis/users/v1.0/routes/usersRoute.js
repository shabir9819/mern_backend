import express from "express";
// import endpoints from "../../../config/endpoints.js";
import endpoints from "../../../../config/endpoints.js";
import {
  loginUser,
  saveSignUpDetails,
  sendOtp,
  verifyOtp,
} from "../controllers/userControllers.js";
import Users from "../models/users.js";
import {
  generateToken,
  isAuthenticateSession,
} from "../controllers/sessionControllers.js";
import { saveFcm } from "../controllers/fcmControllers.js";

const { save_fcm, send_otp, login, verify_otp, save_signup_name } = endpoints;

const router = express.Router();

router.post(`${save_fcm}`, saveFcm);
router.post(`${send_otp}`, sendOtp);
// router.post(`${register}`, registerUser);
router.post(`${login}`, loginUser);
router.post(`${verify_otp}`, verifyOtp);
router.post(`${save_signup_name}`, isAuthenticateSession, saveSignUpDetails);

export default router;
