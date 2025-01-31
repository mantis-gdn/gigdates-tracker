const { getLogs } = require('./log'); // Shared log module

exports.handler = async () => {
    try {
        console.log('Starting to fetch logs...');
        const logs = await getLogs(); // Ensure async/await is used
        console.log('Logs retrieved:', logs);

        if (!Array.isArray(logs)) {
            console.error('Logs are not in array format:', logs);
            throw new Error('Logs are not in array format');
        }

        return {
            statusCode: 200,
            body: JSON.stringify(logs, null, 2), // Pretty print logs
        };
    } catch (error) {
        console.error('Error retrieving logs:', error.message, error.stack);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to retrieve logs',
                details: error.message,
            }),
        };
    }
};
