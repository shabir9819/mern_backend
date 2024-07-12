import express from "express";
// import endpoints from "../../../config/endpoints.js";
import endpoints from "../../../../config/endpoints.js";
import {
  deleteUserAccount,
  getMasters,
  loginCheck,
  logoutUser,
  resendOtpToNewMobile,
  saveSignUpDetails,
  saveUserProfile,
  sendOtp,
  verifyNewMobile,
  verifyOtp,
} from "../controllers/user.controllers.js";
import Users from "../models/users.model.js";
import {
  generateToken,
  isAuthenticateSession,
} from "../controllers/session.controllers.js";
import { saveFcm } from "../controllers/fcm.controllers.js";

const {
  save_fcm,
  send_otp,
  login_check,
  logout,
  verify_otp,
  verify_new_mobile,
  resend_new_mobile_otp,
  save_signup_name,
  save_profile,
  get_masters,
  delete_account,
} = endpoints;

const router = express.Router();

router.post(`${save_fcm}`, saveFcm);
router.post(`${send_otp}`, sendOtp);
router.post(`${verify_otp}`, verifyOtp);
router.post(`${verify_new_mobile}`, isAuthenticateSession, verifyNewMobile);
router.post(
  `${resend_new_mobile_otp}`,
  isAuthenticateSession,
  resendOtpToNewMobile
);
router.post(`${login_check}`, isAuthenticateSession, loginCheck);
router.post(`${save_signup_name}`, isAuthenticateSession, saveSignUpDetails);
router.post(`${save_profile}`, isAuthenticateSession, saveUserProfile);
router.post(`${logout}`, isAuthenticateSession, logoutUser);
router.post(`${delete_account}`, isAuthenticateSession, deleteUserAccount);
router.post(`${get_masters}`, isAuthenticateSession, getMasters);

export default router;
