const { Client, fql } = require('faunadb');

exports.handler = async (event) => {
  const { headers } = event;

  // Connect to the Fauna database using the new client
  const client = new Client({
    secret: process.env.FAUNA_SECRET_KEY
  });

  // Extract pathname from referer
  const referer = headers.referer;
  if (!referer) {
    return {
      statusCode: 400,
      body: 'Missing referer header'
    };
  }

  const { pathname } = new URL(referer);

  try {
    // Query to check if the document exists and update or create it
    const result = await client.query(fql`
      let match = hits.where(.pathname == ${pathname})
      if (match.isEmpty()) {
        hits.create({ pathname: ${pathname}, hits: 1 })
      } else {
        let doc = match.first()
        doc.update({ hits: doc.hits + 1 })
      }
    `);

    console.log('Fauna Response:', result);
  } catch (error) {
    console.error('Fauna Error:', error);
    return {
      statusCode: 500,
      body: 'Fauna query error'
    };
  }

  // Return a 1x1 pixel gif
  return {
    statusCode: 200,
    body: 'R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==',
    headers: { 'content-type': 'image/gif' },
    isBase64Encoded: true
  };
};
