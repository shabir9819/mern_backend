const defaultLoggerMessage = "Default Logger Message";

const customLogger = (message = defaultLoggerMessage, status = "info") => {
  const statusMappings = {
    info: "\x1b[1m\x1b[34mℹ️ INFO:", // Bold and bright blue color
    success: "\x1b[1m\x1b[32m✅ SUCCESS:", // Bold and bright green color
    error: "\x1b[1m\x1b[31m❌ ERROR:", // Bold and bright red color
    warning: "\x1b[1m\x1b[33m⚠️ WARNING:", // Bold and bright yellow color
    debug: "\x1b[1m\x1b[35m🐞 DEBUG:", // Bold and bright purple color
    custom: "\x1b[1m\x1b[36m⚙️ CUSTOM:", // Bold and bright cyan color
    // Add more statuses as needed
  };

  const resetStyle = "\x1b[0m"; // Reset style

  const statusPrefix = statusMappings[status] || "ℹ️ UNKNOWN STATUS:";
  console.log(`${statusPrefix} ${JSON.stringify(message)} ${resetStyle}`);
};

// Export the customLogger for use in other files
export default customLogger;
