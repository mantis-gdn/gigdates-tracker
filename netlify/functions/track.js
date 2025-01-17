// In-memory log array
let logs = [];

exports.handler = async (event) => {
  try {
    console.log("HTTP Method:", event.httpMethod);

    // Handle preflight requests (OPTIONS)
    if (event.httpMethod === "OPTIONS") {
      console.log("Handling OPTIONS preflight request");
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

    // Append the new log entry to in-memory logs
    logs.push({
      eventType: data.eventType,
      timestamp: data.timestamp,
      url: data.url,
      referrer: data.referrer,
    });

    console.log("Current Logs:", logs); // Logs available for debugging

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
