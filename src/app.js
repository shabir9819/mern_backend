import express from "express";
import dotenvAdapter from "./libs/dotenv.js";
import connectToMongo from "./utils/mongoose.js";
import commonErrorHandler from "./middlewares/commonErrorHandler.middleware.js";
import envKeys from "./config/envKeys.js";

const PORT = envKeys.port || 8000;

// Set config for .env
dotenvAdapter.getConfig();

// Connecting server to database
connectToMongo();

// Converting express to Json
const app = express();

// Set up multer storage and file naming options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // specify the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // specify the file name
  },
});

// Cors setup
import corsAdapter from "./libs/cors.js";

const corsOptions = {
  origin: envKeys.corsOrigin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
corsAdapter.configureCorsWithAllOptions(corsOptions);
app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// Multer setup
import multer from "multer";

const upload = multer({ storage: storage });
const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "documents", maxCount: 5 },
]);

// Importing apis and relevant middlewares
import { validateApiKeys } from "./middlewares/checkApiKeys.middleware.js";
import users from "./apis/users/index.js";
import { accessDebugFileAndDisplay } from "./apis/users/v1.0/controllers/extra.controllers.js";

// Apis
app.get("/api", async (req, res) => {
  try {
    res.send("working..");
  } catch (e) {
    console.log(e);
  }
});
app.use("/api", validateApiKeys, uploadFields, users);
app.use("/api_debug/:endpoint", accessDebugFileAndDisplay);

// Default Error middleware
app.use(commonErrorHandler);

app.listen(PORT, () => console.log(`Your server is running at port: ${PORT}`));
