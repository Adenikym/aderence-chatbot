const { parseTime } = require('../../services/parseTime');

describe('parseTime', () => {
  test('parses simple am time', () => {
    expect(parseTime('8am')).toEqual({ hour: 8, minute: 0 });
  });

  test('parses time with minutes', () => {
    expect(parseTime('2:30pm')).toEqual({ hour: 14, minute: 30 });
  });

  test('parses 24-hour format', () => {
    expect(parseTime('14:00')).toEqual({ hour: 14, minute: 0 });
  });

  test('handles midnight and noon', () => {
    expect(parseTime('12am')).toEqual({ hour: 0, minute: 0 });
    expect(parseTime('12pm')).toEqual({ hour: 12, minute: 0 });
  });

  test('returns null for unparseable input', () => {
    expect(parseTime('morning')).toBeNull();
    expect(parseTime('')).toBeNull();
    expect(parseTime('  ')).toBeNull();
    expect(parseTime(null)).toBeNull();
    expect(parseTime(undefined)).toBeNull();
  });
});
