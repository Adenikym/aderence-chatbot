const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function getUser(phone) {
  const doc = await db.collection('users').doc(phone).get();
  return doc.exists ? doc.data() : null;
}

async function updateUser(phone, data) {
  await db.collection('users').doc(phone).set(data, { merge: true });
}

async function logCheckin(phone, response) {
  await db.collection('checkins').add({
    phone,
    response,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
}

module.exports = { getUser, updateUser, logCheckin };