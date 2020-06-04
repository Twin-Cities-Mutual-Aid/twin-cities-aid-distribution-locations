/**
 * A super simple language translation tool
 */

// const translationDataExample = {
//   'hello' : {
//     'eng': 'Hello!',
//     'spa': 'Hola!',
//     'kar': '',
//     'som': 'Salaan!',
//     'hmn': 'Nyob zoo!'
//   }
// }

class Translator {
  attr = 'data-translation-id'

  constructor(translations) {
    this.translations = translations
  }

  // this converts a `gsx$keyname` to `keyname
  convertGoogleKey(key) {
    return 
  }

  /**
   * Replace the translatable elements on the page with translated terms (if available)
   * 
   * @param {string} lang key for the desired language (example: 'spa')
   */
  translate(lang) {
    this.els = document.querySelectorAll(`[${this.attr}]`) 
    
    let current
    for (let i = 0; i < this.els.length; i++) {
      current = this.els[i]
      
      const id = current.getAttribute(this.attr)
      // skip if theres no id, or no translation
      if (!id || !this.translations[id] ) continue;

      const term = this.translations[id][lang]
      if (term && term.length) {
        current.innerHTML = term
      }
    }
  }
}


Translator.ParseGoogleSheetData = function(data) {
  const idKey = 'gsx$id'
  const map = {}
  let langKeys

  // find the object keys for language translations
  const extractLangKeys = e => {
    const keys = []
    Object.keys(e).forEach(k => {
      if (k.indexOf('gsx$') > -1 && k !== idKey) {
        keys.push(k)
      }
    })
    return keys
  }

  data.feed.entry.forEach(e => {
    try {
      // skip if id is missing
      if (!e[idKey].$t) return;
      // fetch language keys if not already available
      if (!langKeys) langKeys = extractLangKeys(e)
      
      map[e[idKey].$t] = {}

      langKeys.forEach(k => {
        // remove google gsx$ prefix
        const lang = k.split('$')[1]
        // add translations
        map[e[idKey].$t][lang] = e[k].$t
      })
      
    // in case of error, log to console and skip to next one
    } catch (e) {
      console.error(e)
      return
    }
  })

  return map
}