# Language Translation

> **Note:** development on this project is moving quickly, so parts of this document may be out of date. Feel free to ask questions in the `#tc-aid-translations` channel in Slack.

- [Language Translation](#language-translation)
  - [Overview](#overview)
    - [The translation spreadsheet](#the-translation-spreadsheet)
    - [Translation files](#translation-files)
    - [Special links](#special-links)
  - [Maintaining Translations](#maintaining-translations)
    - [Translating existing terms](#translating-existing-terms)
    - [Creating a new term](#creating-a-new-term)
    - [Adding a new language](#adding-a-new-language)
      - [Create a new translation file](#create-a-new-translation-file)
      - [Moment.js](#momentjs)
      - [Enabling the language](#enabling-the-language)
      - [Add language checklist](#add-language-checklist)
  - [Technical Details](#technical-details)
    - [Adding a term in markup (`data-translation-id`)](#adding-a-term-in-markup-data-translation-id)
    - [Getting a translated term in js code (`get`)](#getting-a-translated-term-in-js-code-get)
    - [Setting the current language (`language`)](#setting-the-current-language-language)
    - [Running translation substitution (`translate`)](#running-translation-substitution-translate)

## Overview

The site translations were originally loaded from a spreadsheet and have now been moved to `json` files that will be version controlled with the rest of the application.

The site translations work by loading the translated terms from the corresponding files, and replacing the hard-coded English terms on the page with the translated ones. If a translated term is missing, the English term will be used. The terms that need to be translated are specified **in the code** in the `data-translation-id` attribute of the element. It will **not** automatically find words on the page.

### The translation spreadsheet

> **Note:** The translation spreadsheet is no longer used by the application. The following section is here for historical purposes.

The spreadsheet used for defining translations is here: https://docs.google.com/spreadsheets/d/1m5QPNP6O8nsQsqJcQbwib_obpXRjmbYYGtwKzzg1l38/edit?pli=1#gid=0. You can request access in the slack channel `#tc-aid-translations`.

Here's the basic format of the spreadsheet:

| id | eng | spa |
| :--------- | :-------- |:--------- |
| lang_name | English | Español |
| lang_name_in_eng | English | Spanish |
| language | Language | Idioma |
| welcome | Welcome! | ¡Bienvenidos! |

The first column (the `id` column) and first row (e.g. `eng`) are **required** and must be filled out for any added row/column. The rest of the cells can be filled in as new translated terms are available.

### Translation files

The translation files are located under [`src/i18n`](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/tree/master/src/i18n). Each file represents a language where the filename follows the format `XXX.json` where XXX is the [`ISO 639-2`](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes) code.

### Special links

If you want to link to a specific language (say you're sending the link to somebody you know speaks Somali) you can add `?lang=XXX` to the end of the URL. Example:

https://twin-cities-mutual-aid.org/?lang=som

---

## Maintaining Translations

### Translating existing terms

If there are missing translations for a specific language, add the appropriate `id` and translation and submit a pull request to get these changes approved and on the website.

### Creating a new term

Checklist:

 - [ ] Create a new entry in `src/i18n/eng.json` with the corresponding `id` and term
 - [ ] Make sure that it is a **unique** `id` (`formatted_like_this`)
 - [ ] Make sure the term is also added to the correct place in the code, using either the `data-translation-id` attribute (in markup) or the `get` method (js code). See technical details below for more on this.
 - [ ] If translations are not provided for every language, tag the pull request with **NEEDS TRANSLATIONS** so that the term can be translated by others.

### Adding a new language

Adding a language involves a few steps:

1. Create a new translation `json` file
2. Check for matching [`moment.js`](https://momentjs.com/) translation
3. Import translation in `translation.js`

#### Create a new translation file

To add a new language, you should first create a copy of [`eng.json`](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/blob/master/src/i18n/eng.json) and change the filename to the 3-letter [`ISO 639-2`](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes) code.

From there you can translate each term on the right side to the corresponding language.

If the language translator contributed their translations using a dedicated Google Sheet for the language, you can use `bin/google-sheet-with-translation-to-json` to generate the initial JSON file. For example, for the [Hindi Translation](https://docs.google.com/spreadsheets/d/1gI9Sdbxbl2jy08rjmJn3MTDeuHM4YzeRcihSaWUANbA/edit), we followed [a tutorial](https://www.freecodecamp.org/news/cjn-google-sheets-as-json-endpoint/) to configure the sheet, then the following:

    export SHEET_ID=1gI9Sdbxbl2jy08rjmJn3MTDeuHM4YzeRcihSaWUANbA # The identifier from the URL for Google Sheet
    ./bin/google-sheet-with-translation-to-json > src/i18n/hin.json

Be sure to add a field for "locale", instead of "id".

If the language translator contributed their translation in a Google Sheet with all other translations, you can copy the new translation into a new dedicated spreadsheet and use the above instructions to create the json file. Make sure to copy the ID column, the English column, then the column of the new language translations. This is the only way for the `/bin/google-sheet-with-translation-to-json` to work correctly.

#### Moment.js

We use [`moment.js`](https://momentjs.com/) to display text based on time computations ("an hour ago", "a few days ago", "in 3 days"). Some languages are already translated and supported by default. For others, we have created a translation file that will work with `moment.js` which can be found under [`src/locale`](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/tree/master/src/locale). To minimize loading locale translations we don't need, instead of loading in all `moment.js` locales, we only copy the ones we need into the `web_modules/moment/dist` folder.

If the language is already supported by `moment.js`, the `locale` value in the `XXX.json` file should match the one that `moment.js` uses. Download the `.js` file that contains the translation from the [`moment.js github`](https://github.com/moment/moment/tree/develop/locale) and place it in the `web_modules/moment/dist` folder.

If `moment.js` does not support the language, you should create a file in the `src/locale` directory with the format `XXX.js` where `XXX` is either a 2-letter [`ISO 639-1`](https://en.wikipedia.org/wiki/ISO_639-1) code if it exists or a 3-letter [`ISO 639-2`](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes). This `XXX` code should then be added to the `locale` value in the `XXX.json` file.

Currently we are only translating the following terms:

```js
relativeTime: {
   future: 'in %s',
   past: '%s ago',
   s: 'a few seconds',
   ss: '%d seconds',
   m: 'a minute',
   mm: '%d minutes',
   h: 'an hour',
   hh: '%d hours',
   d: 'a day',
   dd: '%d days',
   M: 'a month',
   MM: '%d months',
   y: 'a year',
   yy: '%d years',
}
```

#### Enabling the language

Language files are imported in `translator.js` and added to the `this.languages` object in the constructor.

```js
constructor() {
   this.languages = {
   eng,
   spa,
   som,
   hmn,
   amh,
   orm,
   oji,
   dak,
   vie
   }
   this.detectLanguage()
}
```

#### Add language checklist

 - [ ] Create a new translation file (`src/i18n/XXX.json`)
 - [ ] `locale` should match existing `moment.js` translation and have a copy of the `moment.js` translation in `web_modules/moment/dist`. OR new `moment.js` locale created (`src/locale/XXX.js`)
 - [ ] Language has been imported in `translator.js`

---

## Technical Details

Some quick notes:

 * The main code for this feature is in `/src/js/translator.js`
 * We are using [`ISO 639-2`](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes) (3-letter) codes instead of the more common `ISO 639-1` (2-letter) because the former has broader language support (for instance: Karen Languages).

 ### Adding a term in markup (`data-translation-id`)

 Terms are added in the markup using the `data-translation-id` data attribute. For instance:

 ```html
 <span data-translation-id="term_name">Default text</span>
 ```
This will automatically be detected and translated when the `translator.translate()` method is called (see below)

 ### Getting a translated term in js code (`get`)

 This is the method for fetching a translation in js code:

`get(<string>, [<string>])`

Arguments

1. The name of the term from the `id` column in the spreadsheet
2. A default string to use if the translated term isn't found

Example:


 ```js
const translatedTerm = translator.get('term_name', 'Default text')
 ```

### Setting the current language (`language`)

The current language is set and retrieved using the `language` getter/setter:

```js
translator.language = 'vie'
const currentLanguage = translator.language
```

### Running translation substitution (`translate`)

`translate([<Element>])`

This will perform translation substitution on the given DOM `Element`. If no `Element` is given, `document` will be used.

```js
document.body.innerHTML = '<span data-translation-id="term_name">Default text</span>'
translator.translate()
```
