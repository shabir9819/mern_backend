import fsAdapter from "../../../../libs/fs.js";
import pathAdapter from "../../../../libs/path.js";
import { asyncHandler } from "../../../../utils/asyncHandler.js";
import * as url from "url";

const accessDebugFileAndDisplay = asyncHandler(async (req, res, next) => {
  const endpoint = req.params.endpoint;
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

  // Split the endpoint to get folder and file name
  const parts = endpoint.split("_");

  const folder = `v${parts.slice(parts.length - 1)[0].replace(".txt", "")}`; // All parts except the last
  const fileName = endpoint; // Use the endpoint as the file name
  const debugFileDir = pathAdapter.join(
    __dirname,
    "../../../debug/",
    folder,
    fileName
  );
  try {
    const fileContent = await fsAdapter.readFile(debugFileDir, "utf-8");

    // Set Content-Type header to indicate text/plain response
    res.setHeader("Content-Type", "text/plain");

    // Send the file content as the response
    res.send(fileContent);
  } catch (error) {
    console.error("Error reading the file:", error);
    res.status(404).send("File not found");
  }
});

export { accessDebugFileAndDisplay };
