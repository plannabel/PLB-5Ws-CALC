const Ajv = require("ajv");
const HDWGM = require("../lib/plb-hwdgm-lib");
const outputJSONSchema = require("../lib/schema.js").outputJSONSchema;

const sampleRequestJSON_A = {
  couple: {
    PersonA: {
      gender: "M",
      aged16to17: false,
      citizen: "EU-EEA"
    },
    PersonB: {
      gender: "F",
      aged16to17: true,
      citizen: "UK"
    }
  },
  wedding: {
    date: "2017-10-15T23:00:00.000Z",
    jurisdiction: "NI",
    marriagePlace: "NI",
    type: "Civil-Marriage,Faith-NonReg-Hindu"
  }
};

const sampleRequestJSON_B = {
  couple: {
    PersonA: {
      gender: "M",
      aged16to17: false,
      citizen: "Other"
    },
    PersonB: {
      gender: "F",
      aged16to17: true,
      citizen: "UK"
    }
  },
  wedding: {
    date: "2017-06-05T23:00:00.000Z",
    jurisdiction: "England",
    marriagePlace: "Scotland",
    type: "Faith-Catholic"
  }
};

let result = null,
  testErrors = []; // An array to hold error messages

describe("HDWGM library @function calculateOpts(tree: JSON)", async () => {
  beforeAll(async () => {
    // Get the result object by passing a JSON object to the function
    result = await HDWGM(sampleRequestJSON_A);
  });

  test("Exported function exists.", () => {
    expect(HDWGM).toBeDefined();
  });
  test("Exported function is a function.", () => {
    expect(typeof HDWGM).toBe("function");
  });
  test("Check output with sampleRequestA is a JSON object", async () => {
    expect(typeof result).toBe("object");
  });
  test("Check JSON output's schema is valid", async () => {
    // use ajv to validate the result object against the result object schema
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(outputJSONSchema);
    const valid = validate(result);

    if (!valid) {
      // add any validation error messages to the errors array
      testErrors.push(validate.errors);
    }
    console.log(result);
    expect(valid).toBe(true);
  });
  afterAll(() => {
    //display the error messages pushed to the errors array, if any
    if (testErrors.length > 0) {
      console.log(testErrors);
    }
  });
});
