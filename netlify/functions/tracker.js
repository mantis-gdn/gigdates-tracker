import { Client, fql } from 'fauna';

const client = new Client({
  secret: process.env.FAUNA_SECRET_KEY,
  endpoint: 'https://db.fauna.com', // Ensure this is the correct endpoint
});

exports.handler = async (event) => {
  const { headers } = event;

  // Extract pathname from referer
  const referer = headers.referer;
  if (!referer) {
    return {
      statusCode: 400,
      body: 'Missing referer header',
    };
  }

  const { pathname } = new URL(referer);

  try {
    // Fauna v10 uses the fql template tag for queries
    const result = await client.query(fql`
      let matchPathname = hits.byPathname(${pathname})
      if (matchPathname == null) {
        hits.create({ pathname: ${pathname}, hits: 1 })
      } else {
        matchPathname.update({ hits: matchPathname.hits + 1 })
      }
    `);

    console.log('Fauna Response:', result);
  } catch (error) {
    console.error('Fauna Error:', error);
    return {
      statusCode: 500,
      body: 'Fauna query error',
    };
  }

  // Return a 1x1 pixel gif
  return {
    statusCode: 200,
    body: 'R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==',
    headers: { 'content-type': 'image/gif' },
    isBase64Encoded: true,
  };
};
