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
    const snapshot = await logsCollection.orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => doc.data() || {}); // Ensure it returns an array
}

module.exports = { addLog, getLogs };
