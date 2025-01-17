// track.js: Track page load events
const { addLog } = require('./log'); // Shared log module

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            const { url, referrer } = body;

            if (!url) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Missing URL' }),
                };
            }

            // Log the page load event using the shared `log.js`
            addLog({ type: 'pageLoad', url, referrer });

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Event logged successfully' }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to log event' }),
            };
        }
    }

    // Respond with an error for unsupported HTTP methods
    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
};
