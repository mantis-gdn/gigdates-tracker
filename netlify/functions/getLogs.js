// Shared in-memory logs
let logs = require("./track").logs;

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(logs),
    };
  } catch (error) {
    console.error("Error retrieving logs:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
