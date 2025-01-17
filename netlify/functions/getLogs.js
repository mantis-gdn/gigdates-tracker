const fs = require("fs");
const path = require("path");

const logFilePath = path.resolve(__dirname, "log.js");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    if (!fs.existsSync(logFilePath)) {
      return { statusCode: 404, body: "Log file not found" };
    }

    const logs = require("./log");
    return {
      statusCode: 200,
      body: JSON.stringify(logs),
    };
  } catch (error) {
    console.error("Error reading logs:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
