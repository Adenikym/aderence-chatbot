const cron = require('node-cron');
const { parseTime } = require('./parseTime');

const activeJobs = new Map();

/**
 * Registers a new daily reminder for a user.
 * @param {string} phone 
 * @param {string} timeStr - e.g. "8am"
 */
function registerReminder(phone, timeStr) {
  const parsed = parseTime(timeStr);
  if (!parsed) return false;

  cancelReminder(phone);

  const cronExpression = `${parsed.minute} ${parsed.hour} * * *`;
  
  const job = cron.schedule(
    cronExpression,
    async () => {
      const Router = require('../flows/router');
      await Router.handleSystemEvent('checkin_due', phone);
    },
    {
      timezone: 'Africa/Lagos'
    }
  );

  activeJobs.set(phone, job);
  return true;
}

/**
 * Stops and removes an existing cron job for a user.
 * @param {string} phone 
 */
function cancelReminder(phone) {
  const job = activeJobs.get(phone);
  if (job) {
    job.stop();
    activeJobs.delete(phone);
  }
}

/**
 * Fetches all participants with a reminderTime and registers their cron jobs.
 * Meant to be called once on server boot.
 */
async function registerAllReminders() {
  const { getAllUsersWithReminders } = require('./db');
  const users = await getAllUsersWithReminders();
  let count = 0;
  for (const user of users) {
    if (user.phone && user.reminderTime) {
      if (registerReminder(user.phone, user.reminderTime)) {
        count++;
      }
    }
  }
  console.log(`[SCHEDULER] Boot: Registered ${count} reminders`);
}

module.exports = { registerReminder, cancelReminder, registerAllReminders };
