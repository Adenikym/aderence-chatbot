const settings = require('../../flows/settings');
const { sendMessage } = require('../../services/whatsapp');
const { updateUser } = require('../../services/db');
const { registerReminder } = require('../../services/scheduler');

jest.mock('../../services/whatsapp', () => ({
  sendMessage: jest.fn(),
}));

jest.mock('../../services/db', () => ({
  updateUser: jest.fn(),
}));

jest.mock('../../services/scheduler', () => ({
  registerReminder: jest.fn(),
}));

describe('Settings Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('start() sets state to updating_reminder and asks for time', async () => {
    await settings.start('2348001234567', { state: 'idle' });

    expect(updateUser).toHaveBeenCalledWith('2348001234567', { state: 'updating_reminder' });
    expect(sendMessage).toHaveBeenCalledWith(
      '2348001234567',
      'What time would you like your daily reminder? (e.g. 8am, 2:30pm)'
    );
  });

  test('handle() with invalid time re-prompts', async () => {
    const user = { state: 'updating_reminder' };
    await settings.handle({ participantPhone: '2348001234567', content: 'morning' }, user);

    expect(sendMessage).toHaveBeenCalledWith(
      '2348001234567',
      "I didn't quite get that — could you try a time like 8am or 2:30pm?"
    );
    expect(updateUser).not.toHaveBeenCalled();
    expect(registerReminder).not.toHaveBeenCalled();
  });

  test('handle() with valid time updates DB, registers reminder, and returns to idle', async () => {
    const user = { state: 'updating_reminder' };
    await settings.handle({ participantPhone: '2348001234567', content: '4:30pm' }, user);

    expect(updateUser).toHaveBeenCalledWith('2348001234567', { 
      reminderTime: '4:30pm', 
      state: 'idle' 
    });

    expect(registerReminder).toHaveBeenCalledWith('2348001234567', '4:30pm');

    expect(sendMessage).toHaveBeenCalledWith(
      '2348001234567',
      "Got it! Your daily reminder has been updated to 4:30pm.\n\nReply with:\n1 – Log today's medication\n2 – Learn about HIV\n3 – Update Reminder Time"
    );
  });
});
