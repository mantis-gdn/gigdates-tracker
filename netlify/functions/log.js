// log.js: Shared in-memory log storage
const logs = []; // Shared memory array

function addLog(event) {
    logs.push({
        ...event,
        timestamp: new Date().toISOString(),
    });
}

function getLogs() {
    return logs;
}

module.exports = { addLog, getLogs };
