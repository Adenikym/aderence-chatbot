/**
 * Parse a free-text time string into { hour, minute }.
 * Returns null if the input cannot be parsed.
 *
 * @param {string} input - e.g. "8am", "2:30pm", "14:00"
 * @returns {{ hour: number, minute: number } | null}
 */
function parseTime(input) {
  if (!input || typeof input !== 'string') return null;

  const cleaned = input.trim().toLowerCase();

  // Match: 8am, 8pm, 8:30am, 2:45pm
  const simple = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (simple) {
    let hour = parseInt(simple[1], 10);
    const minute = simple[2] ? parseInt(simple[2], 10) : 0;
    const period = simple[3];
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    return { hour, minute };
  }

  // Match: 14:00, 08:30
  const military = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (military) {
    const hour = parseInt(military[1], 10);
    const minute = parseInt(military[2], 10);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return { hour, minute };
    }
  }

  return null;
}

module.exports = { parseTime };
