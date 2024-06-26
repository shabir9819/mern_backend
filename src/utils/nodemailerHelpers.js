import envKeys from "../config/envKeys.js";
import nodemailerAdapter from "../libs/nodemailer.js";

const defaultOptions = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: envKeys.nodemailerUser,
    pass: envKeys.nodemailerPassword,
  },
};

const generateOtp = (length = 6) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

const generateOtpExpiry = () => {
  let otpExpiry = new Date();
  const otpExpiryTime = envKeys.otpExpiryTime;
  otpExpiry.setMinutes(otpExpiry.getMinutes() + parseInt(otpExpiryTime, 10));
  return otpExpiry;
};

const sendOtpEmail = async (
  toEmail,
  subject = "Your OTP Code",
  otp,
  transporterOptions = defaultOptions
) => {
  try {
    const transporter = await nodemailerAdapter.createTransport(
      transporterOptions
    );
    const mailOptions = {
      from: transporterOptions.auth.user,
      to: toEmail,
      subject: subject,
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    };
    const info = await nodemailerAdapter.sendMail(transporter, mailOptions);
    return otp; // Return the OTP for verification purposes
  } catch (error) {
    throw new Error(`Error sending OTP email: ${error.message}`);
  }
};

export { generateOtp, sendOtpEmail, generateOtpExpiry };
