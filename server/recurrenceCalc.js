const { RRule } = require("rrule");

const calculateRecurrenceDates = (startDate, recurrenceInterval) => {
  const intervalMap = {
    daily: RRule.DAILY,
    weekly: RRule.WEEKLY,
    biweekly: RRule.WEEKLY,
    monthly: RRule.MONTHLY,
    annually: RRule.YEARLY,
  };

  if (!intervalMap[recurrenceInterval]) {
    throw new Error(`Invalid recurrence interval: ${recurrenceInterval}`);
  }

  const rule = new RRule({
    freq: intervalMap[recurrenceInterval],
    interval: recurrenceInterval === "biweekly" ? 2 : 1,
    dtstart: new Date(startDate),
    count: 10, // Generate only the next 10 occurrences
  });

  return rule.all();
};

module.exports = { calculateRecurrenceDates };
