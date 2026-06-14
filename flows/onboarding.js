const { sendMessage } = require('../services/whatsapp');
const { updateUser } = require('../services/db');

async function start(from) {
  await updateUser(from, { state: 'onboarding', step: 'ask_name' });
  await sendMessage(from, `Hello! 👋 Welcome. I'm here to support your daily wellness routine.\n\nWhat name would you like me to call you?`);
}

async function handle(from, text, user) {
  if (user.step === 'ask_name') {
    await updateUser(from, { preferredName: text, step: 'ask_reminder_time' });
    await sendMessage(from, `Nice to meet you, ${text}! 😊\n\nWhat time should I send your daily reminder? (e.g. 8am, 2pm)`);
    return;
  }
  if (user.step === 'ask_reminder_time') {
    await updateUser(from, { reminderTime: text, step: 'done', state: 'idle' });
    await sendMessage(from, `You're all set! I'll check in with you daily at ${text}.\n\nReply with:\n1 – Log today's medication\n2 – Learn about HIV`);
    return;
  }
}

module.exports = { start, handle };