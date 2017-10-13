// @flow

const Ajv = require("ajv");

const moment = require("moment"); // @source http://momentjs.com/docs

const PLB_dateHelpers = require("./plb-date-helpers.js");
const schema = ({ inputJSONSchema } = require("./schema.js"));

/** 
 * @function
 * @param tree
 * @returns {{}}
 */
const calculateOpts = async tree => {
  return new Promise((resolve, reject) => {
    if (
      tree === null ||
      typeof tree === "undefined" ||
      typeof tree !== "object"
    ) {
      reject({ errors: "Input JSON is missing, null or undefined." });
    }

    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(tree);

    if (!valid) {
      reject(new Error(JSON.stringify(validate.errors)));
    }

    // Result object to eventually return via resolve()
    let result = {};

    let couple = {};

    // 'Calculate' gender
    couple.sameSex = tree.couple.PersonA.gender == tree.couple.PersonB.gender;
    String(tree.wedding.type).search("Civil-Partnership") > -1
      ? (couple.sameSex = true)
      : false;

    couple.under18 =
      tree.couple.PersonA.aged16to17 || tree.couple.PersonB.aged16to17;

    // Calculate immigration status
    couple.citizenBothSame =
      tree.couple.PersonA.citizen == tree.couple.PersonB.citizen;
    couple.citizenOneIsUK =
      tree.couple.PersonA.citizen == "UK" ||
      tree.couple.PersonB.citizen == "UK";
    couple.citizenOneIsEUEEA =
      tree.couple.PersonA.citizen == "EU-EEA" ||
      tree.couple.PersonB.citizen == "EU-EEA";
    couple.citizenOneIsOther =
      tree.couple.PersonA.citizen == "Other" ||
      tree.couple.PersonB.citizen == "Other";

    //Add the couple object to the returned object
    result.couple = couple;

    // Work out the countries
    let jurisdictions = {};
    jurisdictions.residentCountry = tree.wedding.jurisdiction;
    jurisdictions.marriageCountry = tree.wedding.marriagePlace;
    jurisdictions.countryEnglandWales =
      String(tree.wedding.jurisdiction).search("EnglandWales") > -1 ||
      String(tree.wedding.marriagePlace).search("EnglandWales") > -1;
    jurisdictions.countrySCO =
      String(tree.wedding.jurisdiction).search("Scotland") > -1 ||
      String(tree.wedding.marriagePlace).search("Scotland") > -1;
    jurisdictions.countryNI =
      String(tree.wedding.jurisdiction).search("NI") > -1 ||
      String(tree.wedding.marriagePlace).search("NI") > -1;

    result.jurisdictions = jurisdictions;

    //DEBUG

    //Work out the faiths
    let faiths = {};
    faiths.isFaith = String(tree.wedding.type).search("Faith-") > -1;
    faiths.isFaithNonReg =
      String(tree.wedding.type).search("Faith-NonReg-") > -1;

    faiths.isAnglican =
      String(tree.wedding.type).search("Anglican") > -1 ||
      String(tree.wedding.type).search("Wales") > -1 ||
      String(tree.wedding.type).search("CoI") > -1 ||
      String(tree.wedding.type).search("ChurchofScotland") > -1;

    faiths.isCatholic = String(tree.wedding.type).search("Catholic") > -1;
    faiths.isJewish = String(tree.wedding.type).search("Jewish") > -1;
    faiths.isMuslim = String(tree.wedding.type).search("Muslim") > -1;

    //Wedding object, with type
    let wedding = {};
    wedding.type = tree.wedding.type;

    // Return all wedding-related objects
    result.wedding = Object.assign({}, wedding, faiths);

    // Calculate dates, notice required and periods

    let dates = {};

    dates.noticePeriod = [28, "days"];
    dates.registerOpens = [12, "months"];

    if (jurisdictions.countrySCO) {
      dates.noticePeriod = [29, "days"];
      dates.registerOpens = [3, "months"];
    }

    if (faiths.isCatholic && jurisdictions.countryNI) {
      dates.noticePeriod = [3, "months"];
    }

    if (couple.OneIsOther) {
      dates.noticePeriod = [70, "days"];
    }

    dates.dateToday = moment().startOf("day");
    dates.weddingDate = moment(tree.wedding.date).startOf("day");

    dates.earliestDateCanMarry = moment(dates.dateToday).add(
      dates.noticePeriod[0],
      dates.noticePeriod[1]
    );
    dates.dateRegisterFrom = PLB_dateHelpers.getDateofNextMonday(
      moment(dates.weddingDate).subtract(
        dates.registerOpens[0],
        dates.registerOpens[1]
      )
    );
    dates.dateRegisterByLatest = PLB_dateHelpers.getDateofPreviousFriday(
      moment(dates.weddingDate).subtract(
        dates.noticePeriod[0],
        dates.noticePeriod[1]
      )
    );
    dates.weddingCountdown = PLB_dateHelpers.dateDiffNiceString(
      PLB_dateHelpers.dateDifference(dates.weddingDate, dates.dateToday)
    );

    dates.sleepsToWeddingDay = PLB_dateHelpers.checkWeddingDateRelativeToToday(
      tree.wedding.date
    );

    dates.dateToday = dates.dateToday.toISOString();
    dates.weddingDate = dates.weddingDate.toISOString();
    dates.earliestDateCanMarry = dates.earliestDateCanMarry.toISOString();
    dates.dateRegisterFrom = dates.dateRegisterFrom.toISOString();
    dates.dateRegisterByLatest = dates.dateRegisterByLatest.toISOString();

    result.dates = dates;

    resolve(result);
  });
};

module.exports = exports = calculateOpts;
