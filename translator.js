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
  constructor(options) {
    this.enabledLanguages = options.enabledLanguages || false
    this._languages = []
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
        if (!this.languageIsEnabled(k)) return
        this._languages.push({
          name: k,
          label: langNames[k]
        })
      })
    }
  }

  languageIsEnabled(lang) {
    if (!this.enabledLanguages.length) return true
    return (this.enabledLanguages.indexOf(lang) > -1)
  }

  /**
   * Simple string format validation
   * @param {string} lang 
   */
  validateLanguageKey(lang) {
    return (lang && lang.length && lang.length === 3)
  }

  get availableLanguages() {
    return this._languages
  }

  set language(lang) {
    if (!this.validateLanguageKey(lang)) {
      // console.error('Attempting to use invalid language: '+lang)
      return
    }
    window.localStorage.setItem(Translator.LOCAL_STORAGE_KEY, lang)

  }

  get language() {
    const lang = window.localStorage.getItem(Translator.LOCAL_STORAGE_KEY)
    if (this.validateLanguageKey(lang)) return lang
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
    } else if (window.localStorage.getItem(Translator.LOCAL_STORAGE_KEY)) {
      lang = window.localStorage.getItem(Translator.LOCAL_STORAGE_KEY)
    }

    this.language = lang
  }

  /**
   * Replace the translatable elements on the page with translated terms (if available)
   */
  translate() {
    if (!this.language) {
      console.error('Attempting to translate without selected language')
      return
    }

    this.setFlagIcons()


    this.els = document.querySelectorAll(`[data-translation-id]`)

    // convert NodeList to Array so we can use forEach
    const els = Array.prototype.slice.call(this.els)

    // replace with translation wherever possible
    els.forEach(el => {
      const id = el.getAttribute('data-translation-id')
      // skip if theres no id, or no translation
      if (!id || !this.translations[id]) return

      // get translated term and replace
      const term = this.get(id)
      if (term && term.length) {
        el.innerHTML = term
      }
    })
  }

  /**
   * Get a translation for a given term id
   */
  get(id, fallback) {

    // if this term doesn't exist, return fallback
    // (even if its empty)
    if (!this.translations[id]) return fallback

    // if fallback isn't provided, use english translation
    if (!fallback) {
      fallback = this.translations[id]['eng']
    }

    // if language isn't set return fallback
    if (!this.language) return fallback

    const term = this.translations[id][this.language]

    // if term and language exist, but result is empty
    // return fallback
    if (!term) return fallback

    return term
  }

  attachSelect(el) {
    const html = this.renderSelect()

  }

  setFlagIcons() {
    const els = document.querySelectorAll('[data-translation-flag]')
    Array.prototype.slice.call(els).forEach(el => {
      el.src = `/images/lang-${this.language}.png`
      el.alt = this.get('lang_name')
    })
  }

  updateSelect(el) {

  }
}

Translator.LOCAL_STORAGE_KEY = 'twma_lang'

/**
 * Convert data structure recieved from Google to format compatible
 * with our constructor
 */
Translator.ParseGoogleSheetData = function (data) {
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