// viewLog.js: Retrieve logs from shared memory
const { getLogs } = require('./log'); // Shared log module

exports.handler = async () => {
    try {
        const logs = getLogs(); // Fetch logs from shared memory

        return {
            statusCode: 200,
            body: JSON.stringify(logs, null, 2), // Pretty print logs
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve logs' }),
        };
    }
};
