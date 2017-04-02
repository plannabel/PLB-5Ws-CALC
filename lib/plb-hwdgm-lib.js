const moment = require('moment') // @source http://momentjs.com/docs

const PLB_dateHelpers = require('./plb-date-helpers.js')


/**
 * @function
 * @param tree
 * @returns {{}}
 */
const calculateOpts = tree => {

  let couple = {}

  // 'Calculate' gender
  couple.sameSex               = tree.couple.PersonA.gender == tree.couple.PersonB.gender
  String(tree.wedding.type).search("Civil-Partnership")>-1 ? couple.sameSex = true : false ;

  // Calculate is under 18 (specifically, aged 16-17)
  couple.isUnder18             = (tree.couple.PersonA.age == "16to17" || tree.couple.PersonB.age == "16to17")

  // Calculate immigration status
  let citizeny = {}

  citizeny.BothSame       = tree.couple.PersonA.citizen ==  tree.couple.PersonB.citizen
  citizeny.OneIsUK        = tree.couple.PersonA.citizen == "UK" || tree.couple.PersonB.citizen == "UK"
  citizeny.OneIsEUEEA     = tree.couple.PersonA.citizen == "EU-EEA" || tree.couple.PersonB.citizen == "EU-EEA"
  citizeny.OneIsOther     = tree.couple.PersonA.citizen == "Other" || tree.couple.PersonB.citizen == "Other"

  couple.citizen= citizeny;

  // Work out the countries
  let countries = {}
  countries.residentCountry       = tree.wedding.jurisdiction
  countries.marriageCountry       = tree.wedding.marriagePlace
  countries.countryEnglandWales   = String(tree.wedding.jurisdiction).search('EnglandWales')>-1 || String(tree.wedding.marriagePlace).search('EnglandWales')>-1
  countries.countrySCO            = String(tree.wedding.jurisdiction).search('Scotland')>-1 || String(tree.wedding.marriagePlace).search('Scotland')>-1
  countries.countryNI             = String(tree.wedding.jurisdiction).search('NI')>-1 || String(tree.wedding.marriagePlace).search('NI')>-1

  couple.countries= countries;

  //DEBUG


  //Work out the faiths
  let faiths = {}
  faiths.faith                 = tree.wedding.type
  faiths.isFaith               = String(tree.wedding.type).search("Faith-")>-1;
  faiths.isFaithNonReg         = String(tree.wedding.type).search("Faith-NonReg-")>-1;

  faiths.isAnglican            = (String(tree.wedding.type).search("Anglican")>-1
  || String(tree.wedding.type).search("Wales")>-1
  || String(tree.wedding.type).search("CoI")>-1
  || String(tree.wedding.type).search("ChurchofScotland")>-1 )

  faiths.isCatholic            = String(tree.wedding.type).search("Catholic")>-1;
  faiths.isJewish              = String(tree.wedding.type).search("Jewish")>-1;
  faiths.isMuslim              = String(tree.wedding.type).search("Muslim")>-1;

  couple.faiths= faiths;

  // Calculate dates, notice required and periods

  let dates = {}

  dates.noticePeriod          = [28,"days"]
  dates.registerOpens         = [12,"months"]

  if (countries.countrySCO) {
    dates.noticePeriod        = [29,"days"]
    dates.registerOpens       = [3,"months"]
  }

  if (faiths.isCatholic && countries.countryNI) {
    dates.noticePeriod        = [3,"months"]
  }

  if (citizeny.OneIsOther) {
    dates.noticePeriod        = [70,"days"]
  }


  dates.dateToday             = moment().startOf('day')
  dates.weddingDate           = moment(tree.wedding.date).startOf('day')
  dates.earliestDateCanMarry  = moment(dates.dateToday  ).add(dates.noticePeriod[0], dates.noticePeriod[1])
  dates.dateRegisterFrom      = PLB_dateHelpers.getDateofNextMonday(
    moment(dates.weddingDate).subtract(dates.registerOpens[0],dates.registerOpens[1])
  )
  dates.dateRegisterByLatest  = PLB_dateHelpers.getDateofPreviousFriday(
    moment(dates.weddingDate).subtract(dates.noticePeriod[0],dates.noticePeriod[1])
  )
  dates.weddingCountdown      = PLB_dateHelpers.dateDiffNiceString(
    PLB_dateHelpers.dateDifference( dates.weddingDate, dates.dateToday )
  )

  dates.sleepsToWeddingDay    = Number(dates.weddingDate.diff(dates.dateToday , "days")) - 1

  couple.dates = dates

  return couple

}

module.exports = exports = calculateOpts