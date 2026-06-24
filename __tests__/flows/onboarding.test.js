const onboarding = require('../../flows/onboarding');
const { sendMessage } = require('../../services/whatsapp');
const { updateUser } = require('../../services/db');

// Mock external services at the boundary
jest.mock('../../services/whatsapp', () => ({
  sendMessage: jest.fn(),
}));

jest.mock('../../services/db', () => ({
  updateUser: jest.fn(),
}));

jest.mock('../../services/scheduler', () => ({
  registerReminder: jest.fn(),
}));

describe('Onboarding Flow - ask_reminder_time', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('re-prompts on invalid time input', async () => {
    const user = { state: 'onboarding', step: 'ask_reminder_time', preferredName: 'Alex' };
    await onboarding.handle({ participantPhone: '2348001234567', content: 'invalid_time' }, user);

    // It shouldn't have saved anything to DB
    expect(updateUser).not.toHaveBeenCalled();
    
    // It should send the re-prompt
    expect(sendMessage).toHaveBeenCalledWith(
      '2348001234567',
      "I didn't quite get that — could you try a time like 8am or 2:30pm?"
    );
  });

  test('saves and proceeds on valid time input', async () => {
    const user = { state: 'onboarding', step: 'ask_reminder_time' };
    await onboarding.handle({ participantPhone: '2348001234567', content: '2:30pm' }, user);

    expect(updateUser).toHaveBeenCalledWith('2348001234567', { 
      reminderTime: '2:30pm', 
      step: 'done', 
      state: 'idle' 
    });

    const { registerReminder } = require('../../services/scheduler');
    expect(registerReminder).toHaveBeenCalledWith('2348001234567', '2:30pm');

    expect(sendMessage).toHaveBeenCalledWith(
      '2348001234567',
      expect.stringContaining("You're all set! I'll check in with you daily at 2:30pm")
    );
  });
});
