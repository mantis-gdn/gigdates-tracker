// a sample fauna db v10 function
const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET, 
  endpoint: 'https://db.fauna.com'
});
exports.handler = async (event, context) => {
  const { email, eventName } = JSON.parse(event.body);

  try {
    const result = await client.query(
      q.Create(q.Collection('tracker'), {
        data: {
          email,
          eventName,
          timestamp: new Date().toISOString(),
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event tracked successfully', result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error tracking event', error }),
    };
  }
};