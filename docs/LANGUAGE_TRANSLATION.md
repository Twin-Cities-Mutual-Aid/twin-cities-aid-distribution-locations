# Language Translation

## Overview

The site translations work by loading a spreadsheet of translated terms, and replacing the hard-coded English terms on the page with the translated ones. If a translated term is missing in the spreadsheet, the English term will be used. The terms that need to be translated are specified **in the code**, it will **not** automatically find words on the page. 

A basic reference for what kind of access is needed for various actions in the translation process. 

| Action | Edit Spreadsheet | Update code |
| :-----------------| :-: | :-: |
| Translating terms | No | No |
| Adding translated terms | Yes | No |
| Adding new terms | Yes | Yes | 
| Adding a Language | Yes | Yes | 
| Enabling a Language | No | Yes |

### The translation spreadsheet

The spreadsheet used for defining translations is here: https://docs.google.com/spreadsheets/d/1m5QPNP6O8nsQsqJcQbwib_obpXRjmbYYGtwKzzg1l38/edit?pli=1#gid=0. You can request access in the slack channel `#tc-aid-translations`.

Here's the basic format of the spreadsheet:

| id | eng | spa | 
| :--------- | :-------- |:--------- |
| lang_name | English | Español |
| lang_name_in_eng | English | Spanish |
| language | Language | Idioma |
| welcome | Welcome! | ¡Bienvenidos! |

The first column (e.g. `lang_name`) and first row (e.g. `eng`) are *required* and must be filled out for any added row/column. The rest of the fields can be filled up as new translated terms are available.

### Glossary

 * **Languages:** Pretty self-explanatory (a column in the spreadsheet)
 * **Terms:** A word or set of words that need to be translated (a row in the spreadsheet). The term is identified by the `id` column
 * **Translated Terms:** An individual translated term (a cell in the spreadsheet)

### Special links

If you want to link to a specific language (like if you're sending the link to somebody you know speaks Somali) you can add `?lang=XXX` to the end of the URL. Example: 

https://twin-cities-mutual-aid.org/?lang=som

If you want to preview languages that have been created but not enabled, add `?dev to the end of the url:

https://twin-cities-mutual-aid.org/?dev

## Maintaining Translations

### Translating existing terms

This is fairly straightforward, just add the term to the correct place in the spreadsheet :). Checklist:

 - [ ] The translated term is added to the correct column/row of the spreadsheet

### Creating a new term

Checklist:

 - [ ] Create a new row in the spreadsheet for the new term
 - [ ] Make sure that there is a **unique** name in the `id` column, `formatted_like_this`
 - [ ] Make sure the term is also added to the correct place in the code, using either the `data-translation-id` attribute or the `translator.get('term_name')` method (see technical details below).

### Adding a new language

Adding a language involves a few steps:

| Action | Edit Spreadsheet | Update code |
| :-----------------| :-: | :-: |
| 1. Adding a column to the spreadsheet | Yes | No |
| 2. Adding a new flag image | No | Yes |
| 3. Enabling the language | No | Yes | 

#### Adding a column to the spreadsheet

A checklist for adding a new column to the checklist

 - [ ] The language header should contain a 3-letter code like `som` (a list of these can be [found here](https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes)) 

#### Adding a new flag image

A checklist for adding new flag images

 - [ ] The image should be a PNG
 - [ ] The image should be 23px wide
 - [ ] The image name should have the format `lang-XXX.png` where "XXX" is the 3-letter language code
 - [ ] The image should be placed in the `/public/images` directory in this repo

#### Enabling the language

Languages are currently enabled via a hard-coded list of enabled languages. At time of writing the languages are defined in code like this:

```js
// show all langs in dev mode
if (window.location.search.indexOf('dev') > -1) {
  langs = ['eng', 'spa', 'kar', 'som', 'hmn', 'amh', 'orm', 'vie']
// otherwise only show these
} else {
  langs = ['eng', 'spa', 'som', 'amh', 'orm', 'vie']
}
```

Note that there are **two** sets of language codes, one for preview mode and one for the live site.

A checklist for enabling a language:

 - [ ] 3-letter code is added to the array for dev/preview mode
 - [ ] 3-letter code is added to the array for production mode


## Technical Details

Keep in mind that development is moving very fast on this project, so this may become outdated pretty quickly.