/**
 * A super simple language translation tool.
 * Expects translation data to be in this format: 
 * 
 * {
 *   'hello' : {
 *      'eng': 'Hello!',
 *      'spa': 'Hola!',
 *      'kar': '',
 *      'som': 'Salaan!',
 *      'hmn': 'Nyob zoo!'
 * }
 * 
 */


class Translator {
  constructor() {
    this.language = ''
    this.availableLanguages = []
    this.translations = {}
    this.detectLanguage()
  }

  setTranslations(translations) {
    this.translations = translations

    // look for row that includes native language names
    const langNames = this.translations['lang_name']

    // set available languages based on langNames
    if (langNames) {
      Object.keys(langNames).forEach(k => {
        this.availableLanguages.push({
          name: k,
          label: langNames[k]
        })
      })
    }
  }

  languageIsSet() {
    return (this.language && this.language.length && this.language.length === 3)
  }

  getAvailableLanguages() {
    return this.availableLanguages
  }

  setLanguage(lang) {
    this.language = lang
    window.localStorage.setItem('lang', lang)
  }

  getLanguage() {
    return this.language
  }

  /**
   * Detect language from environment
   */
  detectLanguage() {
    let lang

    // if language is defined in querystring, use that one
    const qs = window.location.search.substring(1)
    const m = /lang=([A-z]+)/i.exec(qs)
    if (m && m.length > 1) {
      lang = m[1]

    // otherwise, check local storage 
    } else if (window.localStorage.getItem('lang')) {
      lang = window.localStorage.getItem('lang')
    }

    if (lang) this.setLanguage(lang)
  }

  /**
   * Replace the translatable elements on the page with translated terms (if available)
   */
  translate() {
    if(!this.language) {
      console.error('Attempting to translate without selected language')
      return
    }

    this.els = document.querySelectorAll(`[data-translation-id]`) 
    
    // convert NodeList to Array so we can use forEach
    const els = Array.prototype.slice.call(this.els)

    // replace with translation wherever possible
    els.forEach(el => {
      const id = el.getAttribute('data-translation-id')
      // skip if theres no id, or no translation
      if (!id || !this.translations[id] ) return

      // get translated term and replace
      const term = this.translations[id][this.language]
      if (term && term.length) {
        el.innerHTML = term
      }
    })

  }
}

/**
 * Convert data structure recieved from Google to format compatible
 * with our constructor
 */
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