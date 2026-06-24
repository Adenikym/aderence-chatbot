const { sendMessage } = require('../services/whatsapp');
const { updateUser } = require('../services/db');
const content = require('../content/knowledge.json');

async function menu(from) {
  await updateUser(from, { state: 'knowledge', step: 'main_menu' });
  await sendMessage(from, content.main_menu.text);
}

async function handle(message, user) {
  const from = message.participantPhone;
  const input = message.content?.trim().toLowerCase() || '';
  const currentStep = user.step || 'main_menu';
  
  const currentNode = content[currentStep];

  // Fallback if node doesn't exist for some reason
  if (!currentNode) {
    return menu(from);
  }

  const nextStepId = currentNode.options?.[input];

  if (!nextStepId) {
    // Invalid option: re-prompt current node
    await sendMessage(from, currentNode.text);
    return;
  }

  if (nextStepId === 'exit') {
    await updateUser(from, { state: 'idle', step: null });
    await sendMessage(from,
      `Main Menu 🏠\n\n` +
      `Reply with:\n` +
      `1 – Log today's medication\n` +
      `2 – Learn about HIV\n` +
      `3 – Update reminder time`
    );
    return;
  }

  const nextNode = content[nextStepId];
  
  if (nextNode) {
    await updateUser(from, { step: nextStepId });
    await sendMessage(from, nextNode.text);
  } else {
    // Failsafe: if the target node doesn't exist, go to main menu
    await menu(from);
  }
}

module.exports = { menu, handle, supportedStates: ['knowledge'] };