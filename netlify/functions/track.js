const { addLog } = require('./log'); // Shared log module

exports.handler = async (event) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allowed HTTP methods
        'Access-Control-Allow-Headers': 'Content-Type', // Allowed headers
    };

    // Handle preflight (OPTIONS) requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight response' }),
        };
    }

    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            const { url, referrer } = body;

            if (!url) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing URL' }),
                };
            }

            // Add log to shared memory
            addLog({ type: 'pageLoad', url, referrer });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'Event logged successfully' }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to log event' }),
            };
        }
    }

    // Respond with an error for unsupported HTTP methods
    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
};
