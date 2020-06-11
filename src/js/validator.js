import { Validator } from "jsonschema";

const v = new Validator();

export const LOCATION_SCHEMA = {
  "properties": {
    // these are injected values from Google Sheets
    "id": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "updated": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "category": {
      "type": "array",
    },
    "title": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "content": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "link": {
      "type": "array",
    }, 
    // These are the Google Sheet columns
    "gsx$mostrecentlyupdated": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$nameoforganization": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$neighborhood": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$addresswithlink": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$currentlyopenforreceiving": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$openingforreceivingdonations": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$closingforreceivingdonations": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$currentlyopenfordistributing": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$openingfordistributingdonations": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$closingfordistributingdonations": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$urgentneed": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$accepting": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$notaccepting": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$seekingvolunteers": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$notes": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$latitude": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$longitude": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$color": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$seekingmoney": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
    },
    "gsx$seekingmoneyurl": {
      "type": "object",
      "properties": {
        "$t": { 
          "type": "string" 
        },
      },
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