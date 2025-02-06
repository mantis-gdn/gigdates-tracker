import { Client } from "fauna";

const client = new Client({
  secret: process.env.FAUNA_SECRET_KEY
});

exports.handler = async (event) => {
  const { headers } = event;

  // Extract pathname from referer
  const referer = headers.referer;
  if (!referer) {
    return {
      statusCode: 400,
      body: "Missing referer header",
    };
  }

  const { pathname } = new URL(referer);

  try {
    // Query using Fauna's FQL v10 object-based syntax
    const result = await client.query({
      query: ` 
        let match = Collection('hits').filter(.pathname == $pathname) 
        if (match.isEmpty()) { 
          Collection('hits').create({ pathname: $pathname, hits: 1 }) 
        } else { 
          let doc = match.first() 
          doc.update({ hits: doc.hits + 1 }) 
        }
      `,
      arguments: { pathname },
    });

    console.log("Fauna Response:", result);
  } catch (error) {
    console.error("Fauna Error:", error);
    return {
      statusCode: 500,
      body: "Fauna query error",
    };
  }

  // Return a 1x1 pixel gif
  return {
    statusCode: 200,
    body: "R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==",
    headers: { "content-type": "image/gif" },
    isBase64Encoded: true,
  };
};
