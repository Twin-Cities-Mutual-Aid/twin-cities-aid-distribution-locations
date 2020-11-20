import jsonschema from "jsonschema";

// export const LOCATION_SCHEMA = {
//   "properties": {
//     // these are injected values from Google Sheets
//     "id": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "updated": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "category": {
//       "type": "array",
//     },
//     "title": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "content": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "link": {
//       "type": "array",
//     }, 
//     // These are the Google Sheet columns
//     "gsx$mostrecentlyupdated": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$nameoforganization": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$neighborhood": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$addresswithlink": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$currentlyopenforreceiving": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$openingforreceivingdonations": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$closingforreceivingdonations": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$currentlyopenfordistributing": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$openingfordistributingdonations": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$closingfordistributingdonations": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$urgentneed": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$accepting": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$notaccepting": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$seekingvolunteers": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$notes": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$latitude": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string",
//           "format": "latitude"
//         },
//       },
//     },
//     "gsx$longitude": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string",
//           "format": "longitude"
//         },
//       },
//     },
//     "gsx$color": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" ,
//           "format": "hexColor"
//         },
//       },
//     },
//     "gsx$seekingmoney": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     },
//     "gsx$seekingmoneyurl": {
//       "type": "object",
//       "properties": {
//         "$t": { 
//           "type": "string" 
//         },
//       },
//     }
//   }
// }

export const LOCATION_SCHEMA = {
  "properties": {
    // these are injected values from Google Sheets
    "id": {
      "type": "string"
    },
    "updated": {
      "type": "string"
    },
    "category": {
      "type": "array",
    },
    "title": {
      "type": "string"
    },
    "content": {
      "type": "string"
    },
    "link": {
      "type": "array",
    }, 
    // These are the Google Sheet columns
    "last_updated": {
      "type": "string"
    },
    "org_name": {
      "type": "string"
    },
    "neighborhood": {
      "type": "string"
    },
    "address": {
      "type": "string"
    },
    "currently_open_for_receiving": {
      "type": "string"
    },
    "opening_for_receiving_donations": {
      "type": "string"
    },
    "closing_for_receiving_donations": {
      "type": "string"
    },
    "currently_open_for_distributing": {
      "type": "string"
    },
    "opening_for_distributing_donations": {
      "type": "string"
    },
    "closing_for_distributing_donations": {
      "type": "string"
    },
    "urgent_need": {
      "type": "string"
    },
    "accepting": {
      "type": "string"
    },
    "not_accepting": {
      "type": "string"
    },
    "seeking_volunteers": {
      "type": "string"
    },
    "notes": {
      "type": "string"
    },
    "latitude": {
      "type": "string",
      "format": "latitude"
    },
    "longitude": {
      "type": "string",
      "format": "longitude"
    },
    "color": {
      "type": "string" ,
      "format": "hexColor"
    },
    "seeking_money": {
      "type": "string"
    },
    "seeking_money_url": {
      "type": "string"
    }
  }
}

let { Validator } = jsonschema;

Validator.prototype.customFormats.hexColor = function(color) {
  // Does NOT support alpha channel on hex colors
  let re = /^#[a-zA-Z0-9]{6}$/;  
  return typeof color === "string" && re.test(color);
};

Validator.prototype.customFormats.latitude = function(lat) {
  let num = parseFloat(lat);
  return !isNaN(num) && typeof num === 'number' && num <= 90 && num >= -90;
};

Validator.prototype.customFormats.longitude = function(lon) {
  let num = parseFloat(lon);
  return !isNaN(num) && typeof num === 'number' && num <= 180 && num >= -180;
};

/*
  Validates data from Google Sheets given an item,
  a valid schema object, and an optional context paramater
*/
export default function validate(item, schema, ctx = {}) {
  let v = new Validator();
  let result = v.validate(item, schema);

  if (result && result.errors && result.errors.length === 0) {
    return true;
  } else {
    console.error(`Failed validating item`, ctx, result.errors);
    return false;
  }
}