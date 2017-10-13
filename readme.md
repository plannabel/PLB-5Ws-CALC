
## Plannabel · PLB-5Ws-CALC 

This microservice calculates key dates for your wedding (UK and NI), and is
is part of Plannabel's 'Five Ws For Your Wedding' web app at https://www.plannabel.com/5Ws

It's built with:
* [`micro@^9.0.0`](https://github.com/zeit/micro) and [`micro-dev@^1.2.3`](https://github.com/zeit/micro-dev) by [ZEIT](https://zeit.co), asynchronous HTTP microservices with ES6 `async` and `await`.
* [`moment@^2.19.1`](https://github.com/moment/moment) to calculate the dates.
* [`ajv@^5.2.3`](https://github.com/epoberezkin/ajv) JSON-Schema validator to validate the JSON object in the request.

### Run 
* Development: `npm run dev` starts [`micro-dev`](https://github.com/zeit/micro-dev), "a belt full of tools that make building microservices using micro a breeze! It's only meant to be used in development, not in production".
* Production: `npm start` starts `micro` on default port 3000 ([other deployment & port options](https://github.com/zeit/micro#port-based-on-environment-variable)).
 
### Try it

**dev mode:  `micro-dev` running on `localhost:3000`**

Send an HTTP POST request with a JSON document... here's an example using `curl` to make the request:

```bash
curl -H "Content-Type: application/json" -X POST -d '{
    "couple": {
        "PersonA": {
            "gender": "M",
            "aged16to17": false,
            "citizen": "EU-EEA"
        },
        "PersonB": {
            "gender": "F",
            "aged16to17": true,
            "citizen": "UK"
        }
    },
    "wedding": {
        "date": "2019-06-05T23:00:00.000Z",
        "jurisdiction": "NI",
        "marriagePlace": "NI",
        "type": "Civil-Marriage,Faith-NonReg-Hindu"
    }
}' localhost:3000
```

Result:

```json
{
  couple: {
    sameSex: false,
    under18: true,
    citizenBothSame: false,
    citizenOneIsUK: true,
    citizenOneIsEUEEA: true,
    citizenOneIsOther: false
  },
  jurisdictions: {
    residentCountry: "NI",
    marriageCountry: "NI",
    countryEnglandWales: false,
    countrySCO: false,
    countryNI: true
  },
  wedding: {
    type: "Civil-Marriage,Faith-NonReg-Hindu",
    isFaith: true,
    isFaithNonReg: true,
    isAnglican: false,
    isCatholic: false,
    isJewish: false,
    isMuslim: false
  },
  dates: {
    noticePeriod: [28, "days"],
    registerOpens: [12, "months"],
    dateToday: "2017-10-11T23:00:00.000Z",
    weddingDate: "2019-06-05T23:00:00.000Z",
    earliestDateCanMarry: "2017-11-09T00:00:00.000Z",
    dateRegisterFrom: "2018-06-05T23:00:00.000Z",
    dateRegisterByLatest: "2019-05-08T23:00:00.000Z",
    weddingCountdown: "1 year, 7 months and 25 days",
    sleepsToWeddingDay: 601
  }
}
```

### JSON request specification:

```
{
  "couple": {
      "PersonA": {
          "gender": "M" | "F",
          "age": "18plus" | "16to17",
          "citizen": "UK" | "EU-EEA" | "Other" 
      },
      "PersonB": {
          "gender": "M" | "F",
          "age": "18plus" | "16to17",
          "citizen": "UK" | "EU-EEA" | "Other"
      }
  },
  "wedding": {
    "date": ISO_DATE_STRING,
    "jurisdiction": "EnglandWales" | "Scotland" | "NI" | "Abroad",
    "marriagePlace": "EnglandWales" | "Scotland" | "NI" | "Abroad",
    "type": "Civil-Marriage"?, "Faith-Anglican"?, "Faith-NonReg-Catholic"?,
             "Faith-ChurchofWales"?, "Faith-NonReg-ChurchofScotland"?,
             "Faith-CoI"?, "Faith-Methodist"?, "Faith-Presbyterian"?, 
             "Civil-Partnership"?, "Faith-Quaker"?, "Faith-NonReg-Hindu"?
             "Faith-Jewish"?, "Faith-NonReg-Muslim"?
  }
}
```
