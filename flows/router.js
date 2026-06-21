const { getUser } = require('../services/db');
const onboarding = require('./onboarding');
const checkin = require('./checkin');
const knowledge = require('./knowledge');

async function handleMessage(message) {
  const from = message.from;
  const text = message.text?.body?.trim().toLowerCase();

  console.log(`[ROUTER] Handling message from ${from} | text: "${text}"`);

  let user = await getUser(from);
  console.log(`[ROUTER] User lookup result:`, user ? `state=${user.state}, step=${user.step}` : 'NEW USER');

  if (!user) {
    console.log(`[ROUTER] New user — starting onboarding`);
    return onboarding.start(from);
  }

  console.log(`[ROUTER] Routing to state: "${user.state}"`);

  switch (user.state) {
    case 'onboarding':
      return onboarding.handle(from, text, user);
    case 'idle':
      return handleIdleInput(from, text, user);
    case 'checkin_pending':
      return checkin.handle(from, text, user);
    case 'knowledge':
      return knowledge.handle(from, text, user);
    default:
      console.warn(`[ROUTER] Unknown state "${user.state}" — restarting onboarding`);
      return onboarding.start(from);
  }
}

async function handleIdleInput(from, text, user) {
  console.log(`[ROUTER] Idle input from ${from}: "${text}"`);
  const { sendMessage } = require('../services/whatsapp');

  if (text === '1') {
    console.log(`[ROUTER] Routing to check-in`);
    return checkin.start(from, user);
  }
  if (text === '2') {
    console.log(`[ROUTER] Routing to knowledge menu`);
    return knowledge.menu(from);
  }

  console.log(`[ROUTER] Unrecognised idle input — sending main menu`);
  await sendMessage(from, `Hello ${user.preferredName} 👋\n\nReply with:\n1 – Log today's medication\n2 – Learn about HIV\n3 – Update reminder time`);
}

module.exports = { handleMessage };