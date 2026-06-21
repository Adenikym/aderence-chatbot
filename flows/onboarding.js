const { sendMessage } = require('../services/whatsapp');
const { updateUser } = require('../services/db');

async function start(from) {
  console.log(`[ONBOARDING] Starting onboarding for ${from}`);
  await updateUser(from, { state: 'onboarding', step: 'ask_name' });
  await sendMessage(from, `Hello! 👋 Welcome. I'm here to support your daily wellness routine.\n\nWhat name would you like me to call you?`);
  console.log(`[ONBOARDING] Sent welcome message to ${from}`);
}

async function handle(from, text, user) {
  console.log(`[ONBOARDING] Step "${user.step}" for ${from} | input: "${text}"`);

  if (user.step === 'ask_name') {
    await updateUser(from, { preferredName: text, step: 'ask_reminder_time' });
    await sendMessage(from, `Nice to meet you, ${text}! 😊\n\nWhat time should I send your daily reminder? (e.g. 8am, 2pm)`);
    console.log(`[ONBOARDING] Name saved: "${text}" — asking for reminder time`);
    return;
  }

  if (user.step === 'ask_reminder_time') {
    await updateUser(from, { reminderTime: text, step: 'done', state: 'idle' });
    await sendMessage(from, `You're all set! I'll check in with you daily at ${text}.\n\nReply with:\n1 – Log today's medication\n2 – Learn about HIV`);
    console.log(`[ONBOARDING] Reminder time saved: "${text}" — onboarding complete for ${from}`);
    return;
  }

  console.warn(`[ONBOARDING] Unexpected step "${user.step}" for ${from}`);
}

module.exports = { start, handle };