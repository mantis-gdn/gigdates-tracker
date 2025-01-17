const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

const db = admin.firestore();
const logsCollection = db.collection('logs');

async function addLog(event) {
    await logsCollection.add({
        ...event,
        timestamp: new Date().toISOString(),
    });
}

async function getLogs() {
    try {
        console.log('Connecting to database...');
        const snapshot = await logsCollection.orderBy('timestamp', 'desc').get();
        console.log('Snapshot retrieved:', snapshot);

        const logs = snapshot.docs.map(doc => doc.data() || {});
        console.log('Processed logs:', logs);

        return logs;
    } catch (error) {
        console.error('Error in getLogs:', error.message, error.stack);
        throw new Error('Failed to fetch logs');
    }
}

module.exports = { addLog, getLogs };
