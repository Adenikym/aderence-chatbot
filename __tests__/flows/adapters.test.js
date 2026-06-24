jest.mock('../../services/db', () => ({}));
jest.mock('../../services/whatsapp', () => ({}));

const onboarding = require('../../flows/onboarding');
const checkin = require('../../flows/checkin');
const knowledge = require('../../flows/knowledge');
const settings = require('../../flows/settings');

describe('Flow Adapters', () => {
  test('each flow module exports an array of supportedStates', () => {
    expect(Array.isArray(onboarding.supportedStates)).toBe(true);
    expect(onboarding.supportedStates).toContain('onboarding');

    expect(Array.isArray(checkin.supportedStates)).toBe(true);
    expect(checkin.supportedStates).toContain('checkin_pending');

    expect(Array.isArray(knowledge.supportedStates)).toBe(true);
    expect(knowledge.supportedStates).toContain('knowledge');

    expect(Array.isArray(settings.supportedStates)).toBe(true);
    expect(settings.supportedStates).toContain('updating_reminder');
  });
});
