const { handleMessage } = require('../../flows/router');
const { getUser } = require('../../services/db');
const settings = require('../../flows/settings');

jest.mock('../../services/db', () => ({
  getUser: jest.fn(),
}));

jest.mock('../../flows/settings', () => ({
  start: jest.fn(),
  handle: jest.fn(),
  supportedStates: ['updating_reminder']
}));

// We also need to mock onboarding, checkin, knowledge, whatsapp just so it doesn't throw if they are called
jest.mock('../../flows/onboarding', () => ({ start: jest.fn(), handle: jest.fn() }));
jest.mock('../../flows/checkin', () => ({ start: jest.fn(), handle: jest.fn() }));
jest.mock('../../flows/knowledge', () => ({ start: jest.fn(), handle: jest.fn() }));
jest.mock('../../services/whatsapp', () => ({ sendMessage: jest.fn() }));

describe('Router Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('typing 3 in idle starts settings flow', async () => {
    getUser.mockResolvedValueOnce({ state: 'idle' });
    
    await handleMessage({
      participantPhone: '2348001234567',
      content: '3'
    });

    expect(settings.start).toHaveBeenCalledWith('2348001234567', { state: 'idle' });
  });

  test('router dispatches to settings flow when in updating_reminder state', async () => {
    const user = { state: 'updating_reminder' };
    getUser.mockResolvedValueOnce(user);
    
    await handleMessage({
      participantPhone: '2348001234567',
      content: '8am'
    });

    expect(settings.handle).toHaveBeenCalledWith({
      participantPhone: '2348001234567',
      content: '8am'
    }, user);
  });

  test('handleSystemEvent routes checkin_due to checkin flow when user is idle', async () => {
    const user = { state: 'idle' };
    const checkin = require('../../flows/checkin');
    const Router = require('../../flows/router');
    const { getUser } = require('../../services/db');
    getUser.mockResolvedValue(user);

    await Router.handleSystemEvent('checkin_due', '2348001234567');

    expect(getUser).toHaveBeenCalledWith('2348001234567');
    expect(checkin.start).toHaveBeenCalledWith('2348001234567', user);
  });

  test('handleSystemEvent sends nudge when user is not idle', async () => {
    const user = { state: 'knowledge', preferredName: 'Alex' };
    const checkin = require('../../flows/checkin');
    const Router = require('../../flows/router');
    const { getUser } = require('../../services/db');
    const { sendMessage } = require('../../services/whatsapp');
    getUser.mockResolvedValue(user);

    await Router.handleSystemEvent('checkin_due', '2348001234567');

    expect(checkin.start).not.toHaveBeenCalled();
    expect(sendMessage).toHaveBeenCalledWith(
      '2348001234567',
      "Hey Alex, don't forget your daily routine today! 💙"
    );
  });
});
