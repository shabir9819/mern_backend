const envKeys = {
  mongoDbUri: process.env.MONGO_DB_URI,
  corsOrigin: process.env.CORS_ORIGIN,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  nodemailerUser: process.env.NODEMAILER_USER,
  nodemailerPassword: process.env.NODEMAILER_PASSWORD,
  accessKeyUserAndroid: process.env.ACCESS_KEY_USER_AND,
  accessKeyUserIos: process.env.ACCESS_KEY_USER_IOS,
  otpExpiryTime: process.env.OTP_EXPIRY_TIME,
};

export default envKeys;
