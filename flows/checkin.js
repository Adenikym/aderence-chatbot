const { sendMessage } = require('../services/whatsapp');
const { updateUser, logCheckin } = require('../services/db');

async function start(from, user) {
  await updateUser(from, { state: 'checkin_pending' });
  await sendMessage(from, `Time to check in! Did you complete your daily routine today?\n\nReply:\n✅ Yes\n❌ No`);
}

async function handle(from, text, user) {
  const tookMeds = text.includes('yes') || text === '1' || text.includes('✅');
  await logCheckin(from, tookMeds ? 'yes' : 'no');
  await updateUser(from, { state: 'idle', lastCheckin: new Date().toISOString() });

  if (tookMeds) {
    await sendMessage(from, `That's great, ${user.preferredName}! 🌟 Keep it up — consistency is key to staying well.`);
  } else {
    await sendMessage(from, `No worries, ${user.preferredName}. Tomorrow is a fresh start. 💙 Try to take it as soon as you can if it's not too late.`);
  }
}

module.exports = { start, handle };