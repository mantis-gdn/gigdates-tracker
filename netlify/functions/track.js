const fs = require("fs");
const path = require("path");

const logFilePath = path.resolve(__dirname, "./log.js");

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "module.exports = [];", "utf-8");
}

exports.handler = async (event) => {
  try {
    console.log("HTTP Method:", event.httpMethod);
    console.log("Origin:", event.headers.origin);

    // Handle preflight requests (OPTIONS)
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

    // Parse the JSON body
    const data = JSON.parse(event.body);
    console.log("Received Data:", data);

    // Read existing logs
    let logs = [];
    if (fs.existsSync(logFilePath)) {
      const logContent = fs.readFileSync(logFilePath, "utf-8");
      logs = eval(logContent.replace("module.exports =", "").trim()) || [];
    }

    // Append the new log entry
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
    console.error("Error:", error.message);
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
