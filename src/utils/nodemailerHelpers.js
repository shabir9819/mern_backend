import nodemailerAdapter from "../libs/nodemailer.js";

const defaultOptions = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "brady.bosco@ethereal.email",
    pass: "ptbZtCbSxKSnFCaw7q",
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

const sendOtpEmail = async (
  toEmail,
  subject = "Your OTP Code",
  otpLength = 6,
  transporterOptions = defaultOptions
) => {
  try {
    const transporter = await nodemailerAdapter.createTransport(
      transporterOptions
    );
    const otp = generateOtp(otpLength);
    const mailOptions = {
      from: transporterOptions.auth.user,
      to: toEmail,
      subject: subject,
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    };
    const info = await nodemailerAdapter.sendMail(transporter, mailOptions);
    console.log(info);
    return otp; // Return the OTP for verification purposes
  } catch (error) {
    throw new Error(`Error sending OTP email: ${error.message}`);
  }
};

export { generateOtp, sendOtpEmail };
