const { json, send } = require("micro");

const HDWGM = require("./lib/plb-hwdgm-lib");

// const exampleData = {"couple":{"PersonA":{"gender":"M","age":"18plus","citizen":"EU-EEA"},"PersonB":{"gender":"F","age":"16to17","citizen":"UK"}},"wedding":{"date":"2019-06-05T23:00:00.000Z","jurisdiction":"EnglandWales","marriagePlace":"Scotland","type":"Civil-Marriage,Faith-NonReg-Hindu"}}

module.exports = async (req, res) => {
  try {
    const data = await json(req);
    const tree = await HDWGM(data);
    send(res, 200, tree);
  } catch (err) {
    send(res, err.statusCode, `${err.statusCode} ${err}`);
  }
};
