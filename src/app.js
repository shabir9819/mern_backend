import express from "express";
import dotenvAdapter from "./libs/dotenv.js";
const PORT = envKeys.port || 8000;
import connectToMongo from "./utils/mongoose.js";
import commonErrorHandler from "./middlewares/commonErrorHandler.js";
import envKeys from "./config/envKeys.js";
import { validateApiKeys } from "./middlewares/checkApiKeys.js";
import users from "./apis/users/index.js";

// Set config for .env
dotenvAdapter.getConfig();

// Connecting server to database
connectToMongo();

// Converting express to Json
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", async (req, res) => {
  try {
    res.send("working..");
  } catch (e) {
    console.log(e);
  }
});

app.use("/api", validateApiKeys, users);

// Default Error middleware
app.use(commonErrorHandler);

app.listen(PORT, () => console.log(`Your server is running at port: ${PORT}`));
