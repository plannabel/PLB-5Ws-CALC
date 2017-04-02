
## Plannabel • PLB-5Ws-CALC 

This microservice calculates key dates for your wedding (UK and NI), and is
is part of Plannabel's 'Five Ws For Your Wedding' web app at https://www.plannabel.com/5Ws

It's built with:
* [`micro`](https://github.com/zeit/micro) by [ZEIT](https://zeit.co)
* [**Moment.js**](https://github.com/moment/moment) to calculate the relative dates

### Run 
* `npn run dev` starts on localhost:8000 with `nodemon` for automatic server restarts during development.
* `npm start` starts `micro` on default port 3000 (other [deployment & port options])(https://github.com/zeit/micro#deployment).
 
### Try it

*dev mode on localhost:8000*

Send an HTTP POST request with a JSON document... here's an example using `curl` for the request and `python` to prettify the JSON response:

```bash
curl -H "Content-Type: application/json" -X POST -d '{
    "couple": {
        "PersonA": {
            "gender": "M",
            "age": "18plus",
            "citizen": "EU-EEA"
        },
        "PersonB": {
            "gender": "F",
            "age": "16to17",
            "citizen": "UK"
        }
    },
    "wedding": {
        "date": "2019-06-05T23:00:00.000Z",
        "jurisdiction": "NI",
        "marriagePlace": "NI",
        "type": "Civil-Marriage,Faith-NonReg-Hindu"
    }
}' localhost:8000 | python -m json.tool
```

Result:

```json
{
    "citizen": {
        "BothSame": false,
        "OneIsEUEEA": true,
        "OneIsOther": false,
        "OneIsUK": true
    },
    "countries": {
        "countryEnglandWales": false,
        "countryNI": true,
        "countrySCO": false,
        "marriageCountry": "NI",
        "residentCountry": "NI"
    },
    "dates": {
        "dateRegisterByLatest": "2019-05-08T23:00:00.000Z",
        "dateRegisterFrom": "2018-06-05T23:00:00.000Z",
        "dateToday": "2017-03-29T23:00:00.000Z",
        "earliestDateCanMarry": "2017-04-26T23:00:00.000Z",
        "noticePeriod": [
            28,
            "days"
        ],
        "registerOpens": [
            12,
            "months"
        ],
        "sleepsToWeddingDay": 797,
        "weddingCountdown": "2 years, 2 months and 7 days",
        "weddingDate": "2019-06-05T23:00:00.000Z"
    },
    "faiths": {
        "faith": "Civil-Marriage,Faith-NonReg-Hindu",
        "isAnglican": false,
        "isCatholic": false,
        "isFaith": true,
        "isFaithNonReg": true,
        "isJewish": false,
        "isMuslim": false
    },
    "isUnder18": true,
    "sameSex": false
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