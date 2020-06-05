/**
 * Simple frontend i18n tool
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
 * Configuration options (passed to the constructor)
 * 
 * {
 *   enabledLanguages: ['eng', 'spa']
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

  /**
   * Set the translation definitions and available languages
   */
  setTranslations(translations) {
    this.translations = translations

    // look for row that includes native language names
    const langNames = this.translations['lang_name']

    // set available languages based on langNames
    if (langNames) {

      // iterate through the language codes
      Object.keys(langNames).forEach(k => {
        if (!this.languageIsEnabled(k)) return
        this._languages.push({
          name: k,
          label: langNames[k]
        })
      })
    }
  }

  /**
   * Check if this language was enabled in configuration
   */
  languageIsEnabled(lang) {
    if (!this.enabledLanguages.length) return true
    return (this.enabledLanguages.indexOf(lang) > -1)
  }

  /**
   * Simple string validation for the language code
   */
  validateLanguageKey(lang) {
    return (typeof lang === 'string' && lang.length && lang.length === 3)
  }

  /**
   * get a map of enabled langauge codes => native language names
   */
  get availableLanguages() {
    return this._languages
  }

  /**
   * Set current language if given one is valid
   */
  set language(lang) {
    if (!this.validateLanguageKey(lang)) {
      // console.error('Attempting to use invalid language: '+lang)
      return
    }
    window.localStorage.setItem(Translator.LOCAL_STORAGE_KEY, lang)
  }

  /**
   * Get current language
   */
  get language() {
    const lang = window.localStorage.getItem(Translator.LOCAL_STORAGE_KEY)
    // i was getting "null" as a string value when empty (???)
    // which is truthy so this makes sure that doesn't get returned
    if (this.validateLanguageKey(lang)) return lang
    return 'eng'
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
    } else {
      lang = window.localStorage.getItem(Translator.LOCAL_STORAGE_KEY)
    }

    // this will validate the language in the setter
    // before saving
    this.language = lang
  }

  /**
   * Find elements with the `data-translation-id` attribute and replace
   * with translated term if one is available in current language
   */
  translate(el) {
    if (!this.language) return

    if (!el) el = document

    this.setFlagIcons()

    this.els = el.querySelectorAll(`[data-translation-id]`)

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
   * Get a translated term for the given id and current language.
   * Fallback is used if no translation is found.
   * If fallback is falsy, then just use English translation
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

  /**
   * Find all images with the `data-translation-flag` and set
   * `src` and `alt` based on the current language
   */
  setFlagIcons() {
    const els = document.querySelectorAll('img[data-translation-flag]')
    Array.prototype.slice.call(els).forEach(el => {
      el.src = `/images/lang-${this.language}.png`
      el.alt = this.get('lang_name')
    })
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

export default Translator