const { getLogs } = require('./log'); // Shared log module

exports.handler = async () => {
    try {
        const logs = await getLogs(); // Ensure async/await is used
        if (!Array.isArray(logs)) {
            throw new Error('Logs are not in array format');
        }

        return {
            statusCode: 200,
            body: JSON.stringify(logs, null, 2), // Pretty print logs
        };
    } catch (error) {
        console.error('Error retrieving logs:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve logs' }),
        };
    }
};
