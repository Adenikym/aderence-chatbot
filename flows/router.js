const { getUser, updateUser } = require('../services/db');
const onboarding = require('./onboarding');
const checkin = require('./checkin');
const knowledge = require('./knowledge');

async function handleMessage(message) {
  const from = message.from; // user's phone number
  const text = message.text?.body?.trim().toLowerCase();

  let user = await getUser(from);

  // New user → start onboarding
  if (!user) {
    return onboarding.start(from);
  }

  // Route based on user's current state
  switch (user.state) {
    case 'onboarding':
      return onboarding.handle(from, text, user);
    case 'idle':
      return handleIdleInput(from, text, user);
    case 'checkin_pending':
      return checkin.handle(from, text, user);
    default:
      return onboarding.start(from);
  }
}

async function handleIdleInput(from, text, user) {
  if (text === '1') return checkin.start(from, user);
  if (text === '2') return knowledge.menu(from);
  // fallback menu
  const { sendMessage } = require('../services/whatsapp');
  await sendMessage(from, `Hello ${user.preferredName} 👋\n\nReply with:\n1 – Log today's medication\n2 – Learn about HIV\n3 – Update reminder time`);
}

module.exports = { handleMessage };