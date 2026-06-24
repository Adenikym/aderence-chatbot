const { sendMessage } = require('../services/whatsapp');
const { updateUser, logCheckin } = require('../services/db');

async function start(from, user) {
  console.log(`[CHECKIN] Starting check-in for ${from}`);
  await updateUser(from, { state: 'checkin_pending' });
  await sendMessage(from, `Time to check in! Did you complete your daily routine today?\n\nReply:\n✅ Yes\n❌ No`);
  console.log(`[CHECKIN] Check-in prompt sent to ${from}`);
}

async function handle(message, user) {
  const from = message.participantPhone;
  const text = message.content?.trim().toLowerCase();
  console.log(`[CHECKIN] Received response from ${from}: "${text}"`);
  const tookMeds = text.includes('yes') || text === '1' || text.includes('✅');
  console.log(`[CHECKIN] Adherence result: ${tookMeds ? 'TAKEN' : 'MISSED'}`);

  await logCheckin(from, tookMeds ? 'yes' : 'no');
  await updateUser(from, { state: 'idle', lastCheckin: new Date().toISOString() });
  console.log(`[CHECKIN] Logged check-in for ${from}`);

  if (tookMeds) {
    await sendMessage(from, `That's great, ${user.preferredName}! 🌟 Keep it up — consistency is key to staying well.`);
  } else {
    await sendMessage(from, `No worries, ${user.preferredName}. Tomorrow is a fresh start. 💙 Try to take it as soon as you can if it's not too late.`);
  }
}

module.exports = { start, handle, supportedStates: ['checkin_pending'] };