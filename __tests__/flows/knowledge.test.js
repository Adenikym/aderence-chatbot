const knowledge = require('../../flows/knowledge');
const { sendMessage } = require('../../services/whatsapp');
const { updateUser } = require('../../services/db');

jest.mock('../../services/whatsapp', () => ({ sendMessage: jest.fn() }));
jest.mock('../../services/db', () => ({ updateUser: jest.fn() }));

jest.mock('../../content/knowledge.json', () => ({
  "main_menu": {
    "text": "Main menu text",
    "options": {
      "1": "node_a",
      "0": "exit"
    }
  },
  "node_a": {
    "text": "Node A text",
    "options": {
      "0": "main_menu"
    }
  }
}));

describe('Knowledge Flow Content Navigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('menu() starts the flow at main_menu', async () => {
    await knowledge.menu('12345');
    expect(updateUser).toHaveBeenCalledWith('12345', { state: 'knowledge', step: 'main_menu' });
    expect(sendMessage).toHaveBeenCalledWith('12345', 'Main menu text');
  });

  test('handle() with valid input traverses to new node', async () => {
    await knowledge.handle({ participantPhone: '12345', content: '1' }, { step: 'main_menu' });
    expect(updateUser).toHaveBeenCalledWith('12345', { step: 'node_a' });
    expect(sendMessage).toHaveBeenCalledWith('12345', 'Node A text');
  });

  test('handle() with 0 at node_a goes back to main_menu', async () => {
    await knowledge.handle({ participantPhone: '12345', content: '0' }, { step: 'node_a' });
    expect(updateUser).toHaveBeenCalledWith('12345', { step: 'main_menu' });
    expect(sendMessage).toHaveBeenCalledWith('12345', 'Main menu text');
  });

  test('handle() with 0 at main_menu exits to idle', async () => {
    await knowledge.handle({ participantPhone: '12345', content: '0' }, { step: 'main_menu' });
    expect(updateUser).toHaveBeenCalledWith('12345', { state: 'idle', step: null });
    expect(sendMessage).toHaveBeenCalledWith('12345', expect.stringContaining('Main Menu'));
  });

  test('handle() with invalid input re-prompts current node', async () => {
    await knowledge.handle({ participantPhone: '12345', content: '9' }, { step: 'main_menu' });
    expect(updateUser).not.toHaveBeenCalled();
    expect(sendMessage).toHaveBeenCalledWith('12345', 'Main menu text');
  });
});
