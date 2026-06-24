require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
const serviceAccount = JSON.parse(
  Buffer.from(base64Key, "base64").toString("utf-8"),
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function getUser(phone) {
  const doc = await db.collection("users").doc(phone).get();
  return doc.exists ? doc.data() : null;
}

async function updateUser(phone, data) {
  await db.collection("users").doc(phone).set(data, { merge: true });
}

async function logCheckin(phone, response) {
  await db.collection("checkins").add({
    phone,
    response,
    timestamp: FieldValue.serverTimestamp(),
  });
}

async function getAllUsersWithReminders() {
  const snapshot = await db
    .collection("users")
    .where("reminderTime", "!=", null)
    .get();
  const users = [];
  snapshot.forEach((doc) => {
    users.push({ phone: doc.id, ...doc.data() });
  });
  return users;
}

module.exports = {
  getUser,
  updateUser,
  logCheckin,
  getAllUsersWithReminders,
  db,
};
