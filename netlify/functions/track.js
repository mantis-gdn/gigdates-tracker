const fs = require("fs");
const path = require("path");

const logFilePath = path.resolve(__dirname, "log.js");

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "module.exports = [];", "utf-8");
}

const logs = require("./log");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
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

    fs.writeFileSync(logFilePath, `module.exports = ${JSON.stringify(logs, null, 2)};`, "utf-8");

    return { statusCode: 200, body: "Event logged successfully" };
  } catch (error) {
    console.error("Logging error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
