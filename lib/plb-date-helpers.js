const moment = require('moment') // @source http://momentjs.com/docs

module.exports = exports

exports.dateDifference = dateDifference
exports.dateDiffNiceString = dateDiffNiceString
exports.getDateofPreviousFriday = getDateofPreviousFriday
exports.getDateofNextMonday  = getDateofNextMonday

function dateDifference(d1, d2) { //@source http://stackoverflow.com/questions/26311489/obtain-difference-between-two-dates-in-years-months-days-in-javascript

  let m = moment(d1);
  let years = m.diff(d2, 'years');
  m.add(-years, 'years');
  let months = m.diff(d2, 'months');
  m.add(-months, 'months');
  let days = m.diff(d2, 'days');

  //DEBUG
  //console.log({years: Math.abs(years), months: Math.abs(months), days: Math.abs(days)})
  return {years: years, months: months, days: days};
}

function dateDiffNiceString(dateDiffn) {

  let year_suffix = " year",
    month_suffix = ' month',
    day_suffix = ' day',
    output = [],
    outString = ''

  dateDiffn.years  > 1 ? year_suffix  += 's' : false
  dateDiffn.months > 1 ? month_suffix += 's' : false
  dateDiffn.days   > 1 ? day_suffix   += 's' : false

  dateDiffn.years   ? output.push(dateDiffn.years + year_suffix)    : false
  dateDiffn.months  ? output.push(dateDiffn.months + month_suffix)  : false
  dateDiffn.days    ? output.push(dateDiffn.days + day_suffix)      : false

  output.reverse()
  output.length == 0 ? outString = null
    : output.length == 1 ? outString = output[0]
      : output.length == 2 ? outString = output[1] + ' and ' + output[0]
        : output.length == 3 ? outString = output[2] + ', ' + output[1] + ' and ' + output[0]
          : false;

  return outString;
}

function getDateofPreviousFriday(date) {
  // Works out the closest previous working day if @param date is a Sat or Sun
  let theFriday = moment(date),
    subtractDays = null;

  switch (theFriday.day()) {
    case 0: subtractDays = 2 ; break; // Sunday
    case 6: subtractDays = 1 ; break; // Saturday
  }

  return theFriday.subtract(subtractDays, 'days');

}

/**
 * Works out the next closest Monday (working day) if @param date is a Sat or Sun
 * @function
 * @name getDateofNextMonday
 * @param {string} date - The given date to parse.
 * @returns {moment} - A MomentJS object containing the date of the nearest Monday.
 */
function getDateofNextMonday (date) {

  let theMonday = moment(date),
    addDays = null;

  switch (theMonday.day()) {
    case 0: addDays = 1 ; break; // Sunday
    case 6: addDays = 2 ; break; // Saturday
  }

  return theMonday.add(addDays, 'days');
}