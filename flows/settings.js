const { sendMessage } = require('../services/whatsapp');
const { updateUser } = require('../services/db');
const { parseTime } = require('../services/parseTime');

async function start(from) {
  console.log(`[SETTINGS] Starting settings flow for ${from}`);
  await updateUser(from, { state: 'updating_reminder' });
  await sendMessage(from, 'What time would you like your daily reminder? (e.g. 8am, 2:30pm)');
}

async function handle(message, user) {
  const from = message.participantPhone;
  const text = message.content?.trim().toLowerCase();
  const parsed = parseTime(text);
  
  if (!parsed) {
    await sendMessage(from, "I didn't quite get that — could you try a time like 8am or 2:30pm?");
    console.log(`[SETTINGS] Invalid time input: "${text}" from ${from}`);
    return;
  }

  await updateUser(from, { reminderTime: text, state: 'idle' });
  
  const { registerReminder } = require('../services/scheduler');
  registerReminder(from, text);

  await sendMessage(
    from, 
    `Got it! Your daily reminder has been updated to ${text}.\n\nReply with:\n1 – Log today's medication\n2 – Learn about HIV\n3 – Update Reminder Time`
  );
  console.log(`[SETTINGS] Reminder time updated to "${text}" for ${from}`);
}

module.exports = { start, handle, supportedStates: ['updating_reminder'] };
