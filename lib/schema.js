const inputJSONSchema = {
  definitions: {
    person: {
      type: "object",
      properties: {
        gender: { type: "string", enum: ["M", "F"] },
        aged16to17: { type: "boolean" },
        citizen: { type: "string", enum: ["UK", "EU-EEA", "Other"] }
      },
      required: ["gender", "age", "citizen"]
    }
  },
  type: "object",
  properties: {
    couple: {
      type: "object",
      properties: {
        PersonA: { $ref: "#/definitions/person" },
        PersonB: { $ref: "#/definitions/person" }
      },
      required: ["PersonA", "PersonB"]
    },
    wedding: {
      type: "object",
      properties: {
        date: {
          type: "string",
          format: "date-time"
        },
        jurisdiction: {
          type: "string",
          enum: ["EnglandWales", "Scotland", "NI", "Abroad"]
        },
        marriagePlace: {
          type: "string",
          enum: ["EnglandWales", "Scotland", "NI", "Abroad"]
        },
        type: {
          type: "string"
        }
      },
      required: ["date", "jurisdiction", "marriagePlace", "type"]
    }
  },
  required: ["couple", "wedding"],
  additionalProperties: false
};

const outputJSONSchema = {
  definitions: {
    noticePeriodArray: {
      type: "array",
      items: [{ type: "integer" }, { type: "string", enum: ["days", "months"] }]
    }
  },
  type: "object",
  properties: {
    couple: {
      type: "object",
      properties: {
        sameSex: { type: "boolean" },
        under18: { type: "boolean" },
        citizenBothSame: { type: "boolean" },
        citizenOneIsUK: { type: "boolean" },
        citizenOneIsEUEEA: { type: "boolean" },
        citizenOneIsOther: { type: "boolean" }
      }
    },
    jurisdictions: {
      type: "object",
      properties: {
        residentCountry: { type: "string" },
        marriageCountry: { type: "string" },
        countryEnglandWales: { type: "boolean" },
        countrySCO: { type: "boolean" },
        countryNI: { type: "boolean" }
      }
    },
    wedding: {
      type: "object",
      properties: {
        type: { type: "string" },
        isFaith: { type: "boolean" },
        isFaithNonReg: { type: "boolean" },
        isAnglican: { type: "boolean" },
        isCatholic: { type: "boolean" },
        isJewish: { type: "boolean" },
        isMuslim: { type: "boolean" }
      }
    },
    dates: {
      type: "object",
      properties: {
        noticePeriod: { $ref: "#/definitions/noticePeriodArray" },
        registerOpens: { $ref: "#/definitions/noticePeriodArray" },
        dateToday: { type: "string" },
        weddingDate: { type: "string" },
        earliestDateCanMarry: { type: "string" },
        dateRegisterFrom: { type: "string" },
        dateRegisterByLatest: { type: "string" },
        weddingCountdown: { type: ["string", "null"] },
        sleepsToWeddingDay: { type: "integer" }
      }
    }
  },
  required: ["couple", "wedding", "jurisdictions", "dates"],
  additionalProperties: false
};

module.exports = {
  inputJSONSchema,
  outputJSONSchema
};
