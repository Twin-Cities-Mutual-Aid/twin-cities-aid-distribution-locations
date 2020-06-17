# Language Translation

> **Note:** development on this project is moving quickly, so parts of this document may be out of date. Feel free to ask questions in the `#tc-aid-translations` channel in Slack.

1. Overview
   1. The translation JSON
   2. Glossary
   3. Special links
2. Maintaining translations
   1. Translating existing terms
   2. Creating a new term
   3. Adding a new language
3. Technical details
   1. Adding a term in markup (`data-translation-id`)
   2. Getting a translated term in js code (`get`)
   3. Setting the current language (`language`)
   4. Running translation substitution (`translate`)

## Overview

The site translations work by loading a JSON file of translated terms, and replacing the hard-coded English terms on the page with the translated ones. If a translated term is missing in the JSON, the English term will be used. The terms that need to be translated are specified **in the code**, it will **not** automatically find words on the page.

### Glossary

 * **Languages:** Pretty self-explanatory (a JSON file)
 * **Terms:** A word or set of words that need to be translated (an entry in the JSON). The term is identified by the key in the JSON entry.
 * **Translated Terms:** An individual translated term (a value in the JSON)

### Special links

If you want to link to a specific language (say you're sending the link to somebody you know speaks Somali) you can add `?lang=XXX` to the end of the URL. Example:

https://twin-cities-mutual-aid.org/?lang=som

If you want to preview languages that have been created but not enabled, add `?dev` to the end of the url:

https://twin-cities-mutual-aid.org/?dev

---

## Maintaining Translations

### Translating existing terms

This is fairly straightforward, just add the term to the correct place in the JSON :). Checklist:

 - [ ] The translated term is added to the JSON

### Creating a new term

Checklist:

 - [ ] Create a new entry in the JSON for the new term
 - [ ] Make sure that there is a **unique** name in the json keys, in snake_case: `formatted_like_this`
 - [ ] Make sure the term is also added to the correct place in the code, using either the `data-translation-id` attribute (in markup) or the `get` method (js code). See technical details below for more on this.

### Adding a new language

Adding a language involves a few steps:

1. Adding a new JSON file
2. Adding a new flag image
3. Enabling the language
4. Extending timestamp locales using Moment.js

#### Adding a new JSON file

Checklist:

 - [ ] The language filename should contain a 3-letter code like `som` (a list of these can be [found here](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes))
 - [ ] This file goes into the equivalent of `src/i18n/som.json` for the new 3-letter code

#### Adding a new flag image

A good resource for hard-to-find flag images:

https://en.wikipedia.org/wiki/Unrepresented_Nations_and_Peoples_Organization#Members

A checklist for adding new flag images

 - [ ] The image should be a PNG
 - [ ] The image should be 23px wide
 - [ ] The image name should have the format `lang-XXX.png` where "XXX" is the 3-letter language code
 - [ ] The image should be placed in the `public/images` directory in this repo

#### Enabling the language

Languages are currently enabled via a hard-coded list of enabled languages. At time of writing the languages are defined in `src/js/translator.js` like this:

```js
import som from './../i18n/som.json'

class Translator {
  constructor() {
    this.languages = {
      ...
      som,
      ...
    }
  }
}
```

A checklist for enabling a language:

 - [ ] 3-letter code is added to the translator

#### Extending timestamp locales using Moment.js

Some languages have an extended translation for better timestamp support using Moment.js in `src/locale`, e.g. `src/locale/so.js`. Moment.js uses the `ISO 639-1` (2-letter) code for its configuration.

---

## Technical Details

Some quick notes:

 * The main code for this feature is in `/src/js/translator.js`
 * We are using [`ISO 639-2`](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes) (3-letter) codes instead of the more common `ISO 639-1` (2-letter) because the former has broader langauge support (for instance: Karen Languages).

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

1. The name of the term from the entries in the JSON
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
