// viewLog.js: View logged events
const { getLogs } = require('./log');

exports.handler = async () => {
    try {
        const logs = getLogs();

        return {
            statusCode: 200,
            body: JSON.stringify(logs, null, 2),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve logs' }),
        };
    }
};
