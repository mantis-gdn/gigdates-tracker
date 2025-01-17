const fs = require("fs");
const path = require("path");

// Path to the log file
const logFilePath = path.resolve(__dirname, "./log.js");

// Ensure log.js exists
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "module.exports = [];", "utf-8");
}

exports.handler = async (event) => {
  try {
    // Handle preflight requests
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://gigdates.net",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: "",
      };
    }

    // Reject unsupported HTTP methods
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: {
          "Access-Control-Allow-Origin": "https://gigdates.net",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: "Method Not Allowed",
      };
    }

    // Parse incoming JSON payload
    const data = JSON.parse(event.body);

    // Read existing logs
    let logs = [];
    if (fs.existsSync(logFilePath)) {
      const logContent = fs.readFileSync(logFilePath, "utf-8");
      logs = eval(logContent.replace("module.exports =", "").trim()) || [];
    }

    // Append the new log
    logs.push({
      eventType: data.eventType,
      timestamp: data.timestamp,
      url: data.url,
      referrer: data.referrer,
    });

    // Write updated logs back to log.js
    fs.writeFileSync(logFilePath, `module.exports = ${JSON.stringify(logs, null, 2)};`, "utf-8");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://gigdates.net",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "Event logged successfully",
    };
  } catch (error) {
    console.error("Logging error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://gigdates.net",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: `Internal Server Error: ${error.message}`,
    };
  }
};
