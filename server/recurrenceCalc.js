const { RRule } = require('rrule');

//rrule string generation
function generateRRule(startDate, interval) {
  const options = {
    dtstart: new Date(startDate),
    count: 10, 
  };

  switch (interval) {
    case 'daily':
      options.freq = RRule.DAILY;
      break;
    case 'weekly':
      options.freq = RRule.WEEKLY;
      break;
    case 'biweekly':
      options.freq = RRule.WEEKLY;
      options.interval = 2;
      break;
    case 'monthly':
      options.freq = RRule.MONTHLY;
      break;
    default:
      throw new Error('Invalid recurrence interval');
  }

  return new RRule(options).toString();
}

//generate recurrence dates
function calculateRecurrenceDates(rruleString) {
  const rule = RRule.fromString(rruleString);
  return rule.all();
}

module.exports = { generateRRule, calculateRecurrenceDates };
