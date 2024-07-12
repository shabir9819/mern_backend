import envKeys from "../config/envKeys.js";
import { ANDROID, IOS } from "../config/osPlatforms.js";

const validateApiKeys = async (req, res, next) => {
  try {
    const { api_key } = req.headers;
    req.request_time = new Date();
    if (api_key === envKeys.accessKeyUserAndroid) {
      req.platform = ANDROID;
    } else if (api_key === envKeys.accessKeyUserIos) {
      req.platform = IOS;
    } else {
      return res.status(401).json({ message: "Invalid API key" });
    }
    next();
  } catch (e) {
    next(e);
  }
};

export { validateApiKeys };
