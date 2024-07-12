import apiVersion from "../config/apiVersions.js";
import dateUtils from "../libs/datefns.js";
import fsAdapter from "../libs/fs.js";
import pathAdapter from "../libs/path.js";
import { removeLeadingSlash } from "./stringHelpers.js";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

function extractApiVersion(url, type = "value") {
  const versionKeys = Object.keys(apiVersion);
  for (const key of versionKeys) {
    if (url.includes(`/${apiVersion[key]}/`)) {
      if (type === "key") {
        return key.replace(/^v/, "");
      } else {
        return apiVersion[key].replace(/^v/, "");
      }
    }
  }
  return null;
}

const updateDebugFile = async (req, data) => {
  try {
    // Use req.originalUrl for full path
    const isPathAvailable = req.route?.path ?? null;
    const originalUrl = req.originalUrl ?? "";
    const originalUrlApiV = extractApiVersion(originalUrl, "key");
    const folderName = `v${originalUrlApiV}`;
    if (isPathAvailable && originalUrlApiV) {
      const reqHeadApiKey = JSON.stringify(req.headers.api_key);
      const reqBody = JSON.stringify(req.body);
      const reqPath = req.route.path;
      const resData = JSON.stringify(data);
      const fileName = `${removeLeadingSlash(reqPath)
        .concat("_")
        .concat(originalUrlApiV)}.txt`;

      const dirPath = pathAdapter.join(__dirname, "../apis/debug/", folderName);
      const filePath = pathAdapter.join(dirPath, fileName);

      const requestJson = JSON.stringify({
        api_key: JSON.parse(reqHeadApiKey),
        ...JSON.parse(reqBody),
      });
      const requestTime = dateUtils.getDateAndTime(new Date());
      const responseTime = Number(
        (new Date().getMilliseconds() -
          new Date(req.request_time).getMilliseconds()) /
          1000
      );
      const formattedResponseTime = `${responseTime.toFixed(3)} ms`;
      const sampleData = `\nREQUEST TIME: ${requestTime} \nRequest \n${requestJson} \nResponse \n${resData} \n${formattedResponseTime} \n`;

      try {
        // Check if the directory exists, if not, create it
        await fsAdapter.access(dirPath);
      } catch (err) {
        await fsAdapter.mkdir(dirPath, { recursive: true });
      }
      // Check if the file exists
      try {
        await fsAdapter.access(filePath);
        // Read existing data from the file
        const existingData = await fsAdapter.readFile(filePath, "utf8");
        // Combine existing data with new data
        const combinedData = sampleData + "\n" + existingData;

        // Write the combined data back to the file
        await fsAdapter.writeFile(filePath, combinedData, "utf8");
      } catch (err) {
        // Create the file with the new data
        await fsAdapter.writeFile(filePath, sampleData, "utf8");
      }
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
    throw new Error(e);
  }
};

export { updateDebugFile };
