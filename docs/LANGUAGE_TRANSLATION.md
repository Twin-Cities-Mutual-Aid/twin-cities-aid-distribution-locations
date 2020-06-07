# Language Translation

## Overview


| id | eng | spa | 
| :--------- | :-------- |:--------- |
| lang_name | English | Español |
| lang_name_in_eng | English | Spanish |
| language | Language | Idioma |
| welcome | Welcome! | ¡Bienvenidos! |

 - **Column names are required**
 - **Column names should be a 3-letter code**, [ideally from this standard](https://en.wikipedia.org/wiki/ISO_639-2).

```html
<span data-translation-id="needs_money">Needs Money</span>
```

## Maintaining Translations

### Translating existing terms

### Creating a new term

### Adding a new language

#### Adding a column to the spreadsheet

A checklist for adding a new column to the checklist

 - [ ] The language header should contain a 3-letter code like `som` (a list of these can be [found here](https://en.wikipedia.org/wiki/ISO_639-2))

#### Adding a new flag image

A checklist for adding new flag images

 - [ ] The image should be a PNG
 - [ ] The image should be 23px wide
 - [ ] The image name should have the format `lang-XXX.png` where "XXX" is the 3-letter language code
 - [ ] The image should be placed in the `/public/images` directory in this repo

#### Enabling the language


## Technical Detials