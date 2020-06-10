const https = require('https')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const result = dotenv.config()
if (result.error) throw result.error

const OUTPUT_DIR = path.resolve(__dirname, '..', 'src', 'lang')

const parse = (data) => {
  const json = JSON.parse(data)
  // get column headers from first row
  const rows = json.feed.entry
  const header = rows.shift()
  const langs = []
  const definitions = {}

  // create empty files for each 
  Object.keys(header).forEach((key) => {
    if (key.indexOf('gsx$') > -1 && key !== 'gsx$id') {
      const lang = key.split('$')[1];
      langs.push(lang)

      let definition = {
        "name" : lang,
        "codes": {
          "639-2": lang
        },
        "terms": {}
      }

      const fn = path.join(OUTPUT_DIR, `${lang}.json`);

      // try loading existing data from file
      try {
        const contents = JSON.parse(fs.readFileSync(fn, 'utf8'));
        if (typeof contents === 'object' && contents.name === lang) {
          definition = contents
        }
      } catch (e) {
        console.error(`file ${fn} could not be opened`, e)
      }
     
      definitions[lang] = definition
    }
  })

  // populate terms
  rows.forEach(row => {
    const id = row['gsx$id'].$t
    langs.forEach(lang => {
      // set term for language
      definitions[lang]['terms'][id] = row['gsx$'+lang].$t
    })
  })

  Object.keys(definitions).forEach(key => {
    const def = definitions[key]
    const fn = path.join(OUTPUT_DIR, `${def.name}.json`);
    fs.writeFileSync(fn, JSON.stringify(def), 'utf8')
  })

}



https.get(process.env.SNOWPACK_PUBLIC_TRANSLATION_URL, (resp) => {
  let data = ''

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { parse(data) });
})