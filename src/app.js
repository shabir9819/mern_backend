import express from "express";
import dotenvAdapter from "./libs/dotenv.js";
const PORT = process.env.PORT || 8000;
import connectToMongo from "./utils/mongoose.js";
import commonErrorHandler from "./middlewares/commonErrorHandler.js";

// Api files
import api_v1 from "./apis/v1.0/index.js";

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

app.use("/api", api_v1);

// Default Error middleware
app.use(commonErrorHandler);

app.listen(PORT, () => console.log(`Your server is running at port: ${PORT}`));
