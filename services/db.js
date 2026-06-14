const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../firebase-key.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

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
    timestamp: FieldValue.serverTimestamp()
  });
}

module.exports = { getUser, updateUser, logCheckin, db };