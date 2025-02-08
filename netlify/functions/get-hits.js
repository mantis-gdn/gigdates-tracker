const { Client, fql } = require('fauna');

const client = new Client({
  secret: process.env.FAUNA_SECRET_KEY,
});

exports.handler = async () => {
  try {
    // Fetch all hits
    const result = await client.query(
      fql`
        hits.all().toArray()
      `
    );

    // Ensure we have an array
    const hits = result.data || [];

    // Group and count pathnames in JavaScript
    const counts = hits.reduce((acc, hit) => {
      const pathname = hit.pathname;
      if (pathname) {
        acc[pathname] = (acc[pathname] || 0) + 1;
      }
      return acc;
    }, {});

    // Convert counts to an array format
    const formattedResults = Object.entries(counts).map(([pathname, count]) => ({
      pathname,
      count,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(formattedResults),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Error fetching hits:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
