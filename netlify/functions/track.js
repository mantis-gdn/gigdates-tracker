// In-memory log array
let logs = [];

exports.handler = async (event) => {
  try {
    console.log("HTTP Method:", event.httpMethod);

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

    const data = JSON.parse(event.body);
    console.log("Received Data:", data);

    logs.push({
      eventType: data.eventType,
      timestamp: data.timestamp,
      url: data.url,
      referrer: data.referrer,
    });

    console.log("Current Logs:", logs);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://gigdates.net",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "Event logged successfully",
    };
  } catch (error) {
    console.error("Unhandled error:", error.message);
    console.error("Error details:", error);

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
