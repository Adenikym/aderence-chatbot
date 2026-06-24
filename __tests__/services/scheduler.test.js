const cron = require('node-cron');
const { registerReminder, cancelReminder, registerAllReminders } = require('../../services/scheduler');

jest.mock('../../services/db', () => ({
  getAllUsersWithReminders: jest.fn(),
  updateUser: jest.fn(),
  getUser: jest.fn()
}));

jest.mock('../../flows/checkin', () => ({
  start: jest.fn(),
  handle: jest.fn()
}));

jest.mock('../../services/whatsapp', () => ({
  sendMessage: jest.fn()
}));

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

describe('Scheduler Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registerReminder creates a node-cron job with Africa/Lagos timezone', () => {
    // Return a mock job object
    const mockJob = { start: jest.fn(), stop: jest.fn() };
    cron.schedule.mockReturnValue(mockJob);

    registerReminder('2348001234567', '2:30pm');

    expect(cron.schedule).toHaveBeenCalledWith(
      '30 14 * * *',
      expect.any(Function),
      expect.objectContaining({ timezone: 'Africa/Lagos' })
    );
  });

  test('cancelReminder stops an existing cron job', () => {
    const mockJob = { start: jest.fn(), stop: jest.fn() };
    cron.schedule.mockReturnValue(mockJob);

    registerReminder('2348001234567', '8am');
    cancelReminder('2348001234567');

    expect(mockJob.stop).toHaveBeenCalled();
  });

  test('calling registerReminder twice cancels the old job', () => {
    const mockJob1 = { start: jest.fn(), stop: jest.fn() };
    const mockJob2 = { start: jest.fn(), stop: jest.fn() };
    cron.schedule.mockReturnValueOnce(mockJob1).mockReturnValueOnce(mockJob2);

    registerReminder('2348001234567', '8am');
    registerReminder('2348001234567', '9am');

    expect(mockJob1.stop).toHaveBeenCalled();
  });

  test('registerAllReminders fetches users and registers them', async () => {
    const { getAllUsersWithReminders } = require('../../services/db');
    getAllUsersWithReminders.mockResolvedValueOnce([
      { phone: 'user1', reminderTime: '8am' },
      { phone: 'user2', reminderTime: '2:30pm' }
    ]);

    cron.schedule.mockReturnValue({ start: jest.fn(), stop: jest.fn() });

    await registerAllReminders();

    // 2 valid reminders from DB, plus 2 from previous tests if we didn't clear activeJobs.
    // Wait, activeJobs is module state, so it persists between tests!
    // But we are spying on cron.schedule.
    expect(cron.schedule).toHaveBeenCalledTimes(2);
    expect(getAllUsersWithReminders).toHaveBeenCalled();
  });

  test('callback fires handleSystemEvent', async () => {
    const Router = require('../../flows/router');
    Router.handleSystemEvent = jest.fn();
    
    cron.schedule.mockReturnValue({ start: jest.fn(), stop: jest.fn() });

    registerReminder('2348001234567', '8am');
    
    // Get the callback passed to cron.schedule
    const callback = cron.schedule.mock.calls[cron.schedule.mock.calls.length - 1][1];
    
    // Execute the callback
    await callback();

    expect(Router.handleSystemEvent).toHaveBeenCalledWith('checkin_due', '2348001234567');
  });
});
