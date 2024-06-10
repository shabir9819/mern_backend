const envKeys = {
  mongoDbUri: process.env.MONGO_DB_URI,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  nodemailerUser: process.env.NODEMAILER_USER,
  nodemailerPassword: process.env.NODEMAILER_PASSWORD,
  accessKeyUserAndroid: process.env.ACCESS_KEY_USER_AND,
  accessKeyUserIos: process.env.ACCESS_KEY_USER_IOS,
};

export default envKeys;
