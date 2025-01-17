const fs = require("fs");
const path = require("path");

const logFilePath = path.resolve(__dirname, "log.js");

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "module.exports = [];", "utf-8");
}

const logs = require("./log");

exports.handler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "gigdates.net", // Allow requests from gigdates.net
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
        "Access-Control-Allow-Origin": "gigdates.net", // Allow requests from gigdates.net
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "Method Not Allowed",
    };
  }

  try {
    const data = JSON.parse(event.body);
    logs.push({
      eventType: data.eventType,
      eventData: data.eventData,
      timestamp: data.timestamp,
      url: data.url,
      referrer: data.referrer,
    });

    // Write the updated logs to the log file
    fs.writeFileSync(logFilePath, `module.exports = ${JSON.stringify(logs, null, 2)};`, "utf-8");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "gigdates.net", // Allow requests from gigdates.net
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "Event logged successfully",
    };
  } catch (error) {
    console.error("Logging error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "gigdates.net", // Allow requests from gigdates.net
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "Internal Server Error",
    };
  }
};
