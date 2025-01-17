let logs = [];

exports.handler = async (event) => {
  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://gigdates.net";

  try {
    console.log("HTTP Method:", event.httpMethod);

    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
        body: "",
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
        body: "Method Not Allowed",
      };
    }

    const data = JSON.parse(event.body);

    if (!data.eventType || !data.timestamp || !data.url || !data.referrer) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
        body: "Missing or invalid data fields",
      };
    }

    if (isNaN(Date.parse(data.timestamp))) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
        body: "Invalid timestamp format",
      };
    }

    logs.push({
      eventType: data.eventType,
      timestamp: new Date(data.timestamp).toISOString(),
      url: data.url,
      referrer: data.referrer,
    });

    console.log("Current Logs:", logs);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
      body: "Event logged successfully",
    };
  } catch (error) {
    console.error("Unhandled error:", error.message);
    console.error("Error details:", error);

    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
      body: `Internal Server Error: ${error.message}`,
    };
  }
};
