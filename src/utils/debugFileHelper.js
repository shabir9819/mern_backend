import dateUtils from "../libs/datefns.js";
import fsAdapter from "../libs/fs.js";
import pathAdapter from "../libs/path.js";
import { removeLeadingSlash } from "./stringHelpers.js";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

const updateDebugFile = async (req, data) => {
  try {
    // Use req.originalUrl for full path
    const reqHeadApiKey = JSON.stringify(req.headers.api_key);
    const reqBody = JSON.stringify(req.body);
    const reqPath = req.route.path;
    const resData = JSON.stringify(data);
    const fileName = `${removeLeadingSlash(reqPath)}.txt`;

    // Use path.join to construct the file path
    const filePath = pathAdapter.join(__dirname, "../apis/debug", fileName);
    // Sample data
    const requestJson = JSON.stringify({
      api_key: JSON.parse(reqHeadApiKey),
      ...JSON.parse(reqBody),
    });
    const requestTime = dateUtils.getDateAndTime(new Date());
    const sampleData = `\n REQUEST TIME: ${requestTime} \n Request \n  ${requestJson} \n Response \n ${resData} \n`;

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
  } catch (e) {
    console.error(`Error: ${e.message}`);
    throw new Error(e);
  }
};

export { updateDebugFile };
