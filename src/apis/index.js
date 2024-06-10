// Android Apis
import { ANDROID, IOS } from "../config/osPlatforms.js";
import android_api_v1 from "./android/v1.0/index.js";

// Ios Apis
import ios_api_v1 from "./android/v1.0/index.js";

const androidApis = (req, res, next) => {
  android_api_v1(req, res, next);
};

const iosApis = (req, res, next) => {
  ios_api_v1(req, res, next);
};

const validateApiPlatform = (req, res, next) => {
  const platform = req.platform;
  if (platform === ANDROID) {
    androidApis(req, res, next);
  } else if (platform === IOS) {
    iosApis(req, res, next);
  }
};

export default validateApiPlatform;
