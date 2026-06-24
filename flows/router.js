const { getUser } = require('../services/db');
const onboarding = require('./onboarding');
const checkin = require('./checkin');
const knowledge = require('./knowledge');
const settings = require('./settings');

async function handleMessage(message) {
  const from = message.participantPhone;
  const text = message.content?.trim().toLowerCase();

  console.log(`[ROUTER] Handling message from ${from} | text: "${text}"`);

  let user = await getUser(from);
  console.log(`[ROUTER] User lookup result:`, user ? `state=${user.state}, step=${user.step}` : 'NEW USER');

  if (!user) {
    console.log(`[ROUTER] New user — starting onboarding`);
    return onboarding.start(from);
  }

  console.log(`[ROUTER] Routing to state: "${user.state}"`);

  if (user.state === 'idle') {
    await handleIdleInput(from, text, user);
    return;
  }

  const flows = [onboarding, checkin, knowledge, settings];
  const matchingFlow = flows.find(flow => flow.supportedStates && flow.supportedStates.includes(user.state));

  if (matchingFlow) {
    console.log(`[ROUTER] Routing to state: "${user.state}"`);
    await matchingFlow.handle(message, user);
    return;
  }

  console.warn(`[ROUTER] Unrecognised state "${user.state}" for ${from} — falling back to onboarding`);
  await onboarding.start(from, user);
}

async function handleIdleInput(from, text, user) {
  console.log(`[ROUTER] Idle input from ${from}: "${text}"`);
  const { sendMessage } = require('../services/whatsapp');

  if (text === '1') {
    console.log(`[ROUTER] Dispatching ${from} to checkin flow`);
    return checkin.start(from, user);
  }
  if (text === '2') {
    console.log(`[ROUTER] Routing to knowledge menu`);
    return knowledge.menu(from);
  }
  if (text === '3') {
    console.log(`[ROUTER] Dispatching ${from} to settings flow`);
    const settings = require('./settings');
    return settings.start(from, user);
  }

  console.log(`[ROUTER] Unrecognised idle input — sending main menu`);
  await sendMessage(from, `Hello ${user.preferredName} 👋\n\nReply with:\n1 – Log today's medication\n2 – Learn about HIV\n3 – Update reminder time`);
}

async function handleSystemEvent(eventName, participantPhone) {
  console.log(`[ROUTER] System Event "${eventName}" for ${participantPhone}`);
  const { getUser } = require('../services/db');
  const user = await getUser(participantPhone) || { state: 'idle' };

  if (eventName === 'checkin_due') {
    if (user.state === 'idle') {
      await checkin.start(participantPhone, user);
    } else {
      const { sendMessage } = require('../services/whatsapp');
      await sendMessage(participantPhone, `Hey ${user.preferredName}, don't forget your daily routine today! 💙`);
    }
  } else {
    console.warn(`[ROUTER] Unhandled system event: ${eventName}`);
  }
}

module.exports = { handleMessage, handleSystemEvent };