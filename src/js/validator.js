/*
  Validates data from Google Sheets given an item,
  a valid schema object, and an optional context paramater
*/
export default function validate(item, schema, ctx = {}) {
  let valid = true;

  for (let key of Object.keys(item)) {
    let type = schema[key];
    let isValid = TYPE_MAP[type];

    // We cannot check untyped fields
    if (type === undefined) {
      console.warn(`Key ${key} is missing from schema`);
      continue;
    }

    if (typeof isValid === "function") {
      if (!isValid(unwrapValue(item[key]))) {
        console.error(`Item failed validation at key '${key}' with value ${unwrapValue(item[key])}, should be type ${type}`, ctx);
        valid = false;
      }
    } else {
      console.error(`Validation function for type ${type} does not exist.`);
    }
  }

  return valid;
}

// Extracts value from a Google Sheets row column object
function unwrapValue(item) {
  if (item && typeof item === "object" && item.$t) {
    return item.$t;
  }

  return undefined;
}

// Maps schema types to validation functions
const TYPE_MAP = {
  "string": isValidString,
  "color": isValidColor,
  "url": maybe(isUrl),
  "nullable": maybe(isValidString),
};

function either(a, b) {
  return (item) => {
    return a(item) || b(item);
  }
}

function maybe(a) {
  return either(isEmpty, a);
}

function isValidString(str) {
  return str && typeof str === "string";
}

function isEmpty(str) {
  return str === "" || str === undefined;
}

function isUrl(url) {
  if (url && typeof url === "string") {
    try {
      new URL(url);
    } catch(_) {
      return false;
    }

    return true;
  }

  return false;
}

function  isValidColor(color) {
  let re = /^#[a-zA-Z0-9]{6}$/;  
  return isValidString(color) && re.test(color);
}

export const LOCATION_SCHEMA = {
  // these are injected values from Google Sheets
  "id": "nullable",
  "updated": "nullable",
  "category": "nullable",
  "title": "nullable",
  "content": "nullable",
  "link": "nullable",
  // These are the Google Sheet columns
  "gsx$mostrecentlyupdated": "string",
  "gsx$nameoforganization": "string",
  "gsx$neighborhood": "string",
  "gsx$addresswithlink": "nullable",
  "gsx$currentlyopenforreceiving": "nullable",
  "gsx$openingforreceivingdonations": "nullable" ,
  "gsx$closingforreceivingdonations": "nullable",
  "gsx$currentlyopenfordistributing": "nullable",
  "gsx$openingfordistributingdonations": "nullable",
  "gsx$closingfordistributingdonations": "nullable",
  "gsx$urgentneed": "nullable",
  "gsx$accepting": "nullable",
  "gsx$notaccepting": "nullable",
  "gsx$seekingvolunteers": "nullable",
  "gsx$notes": "nullable",
  "gsx$latitude": "string",
  "gsx$longitude": "string",
  "gsx$color": "color",
  "gsx$seekingmoney": "nullable",
  "gsx$seekingmoneyurl": "url"
}
