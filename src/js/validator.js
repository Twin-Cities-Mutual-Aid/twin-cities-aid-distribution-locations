const Validator = require('jsonschema').Validator;

const v = new Validator();

const LOCATION_SCHEMA = {
  "properties": {
    // these are injected values from Google Sheets
    "id": {
      "type": "string",
    },
    "updated": {
      "type": "string",
    },
    "category": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "link": {
      "type": "string"
    }, 
    // These are the Google Sheet columns
    "gsx$mostrecentlyupdated": {
      "type": "string"
    },
    "gsx$nameoforganization": {
      "type": "string"
    },
    "gsx$neighborhood": {
      "type": "string",
    },
    "gsx$addresswithlink": {
      "type": "string"
    },
    "gsx$currentlyopenforreceiving": {
      "type": "string"
    },
    "gsx$openingforreceivingdonations": {
      "type": "string"
    },
    "gsx$closingforreceivingdonations": {
      "type": "string"
    },
    "gsx$currentlyopenfordistributing": {
      "type": "string"
    },
    "gsx$openingfordistributingdonations": {
      "type": "string"
    },
    "gsx$closingfordistributingdonations": {
      "type": "string"
    },
    "gsx$urgentneed": {
      "type": "string"
    },
    "gsx$accepting": {
      "type": "string"
    },
    "gsx$notaccepting": {
      "type": "string"
    },
    "gsx$seekingvolunteers": {
      "type": "string"
    },
    "gsx$notes": {
      "type": "string"
    },
    "gsx$latitude": {
      "type": "string"
    },
    "gsx$longitude": {
      "type": "string",
    },
    "gsx$color": {
      "type": "color",
    },
    "gsx$seekingmoney": {
      "type": "string",
    },
    "gsx$seekingmoneyurl": {
      "string": "url",
    }
  }
}

/*
  Validates data from Google Sheets given an item,
  a valid schema object, and an optional context paramater
*/
export default function validate(item, schema, ctx = {}) {
  let result = v.validate(item, schema);

  if (result && Array.isArray(result.errors) && result.errors.length > 0) {
    console.error(`Failed validating item`, ctx, result.errors);
    return false;
  }
  return true;
}

// // Extracts value from a Google Sheets row column object
// function unwrapValue(item) {
//   if (item && typeof item === "object" && item.$t) {
//     return item.$t;
//   }

//   return undefined;
// }

// // Maps schema types to validation functions
// const TYPE_MAP = {
//   "string": isValidString,
//   "color": isValidColor,
//   "url": maybe(isUrl),
//   "nullable": maybe(isValidString),
// };

// function either(a, b) {
//   return (item) => {
//     return a(item) || b(item);
//   }
// }

// function maybe(a) {
//   return either(isEmpty, a);
// }

// function isValidString(str) {
//   return str && typeof str === "string";
// }

// function isEmpty(str) {
//   return str === "" || str === undefined;
// }

// function isUrl(url) {
//   if (url && typeof url === "string") {
//     try {
//       new URL(url);
//     } catch(_) {
//       return false;
//     }

//     return true;
//   }

//   return false;
// }

// function  isValidColor(color) {
//   let re = /^#[a-zA-Z0-9]{6}$/;  
//   return isValidString(color) && re.test(color);
// }

// const LOCATION_SCHEMA = {
//   // these are injected values from Google Sheets
//   "id": "nullable",
//   "updated": "nullable",
//   "category": "nullable",
//   "title": "nullable",
//   "content": "nullable",
//   "link": "nullable",
//   // These are the Google Sheet columns
//   "gsx$mostrecentlyupdated": "string",
//   "gsx$nameoforganization": "string",
//   "gsx$neighborhood": "string",
//   "gsx$addresswithlink": "nullable",
//   "gsx$currentlyopenforreceiving": "nullable",
//   "gsx$openingforreceivingdonations": "nullable" ,
//   "gsx$closingforreceivingdonations": "nullable",
//   "gsx$currentlyopenfordistributing": "nullable",
//   "gsx$openingfordistributingdonations": "nullable",
//   "gsx$closingfordistributingdonations": "nullable",
//   "gsx$urgentneed": "nullable",
//   "gsx$accepting": "nullable",
//   "gsx$notaccepting": "nullable",
//   "gsx$seekingvolunteers": "nullable",
//   "gsx$notes": "nullable",
//   "gsx$latitude": "string",
//   "gsx$longitude": "string",
//   "gsx$color": "color",
//   "gsx$seekingmoney": "nullable",
//   "gsx$seekingmoneyurl": "url"
// }
