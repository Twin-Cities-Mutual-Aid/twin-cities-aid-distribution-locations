/**
 * Simple frontend i18n tool
 */

const DEFAULT_LANGUAGE = 'eng'
const LOCAL_STORAGE_KEY = 'twam_lang'
const DATA_ATTRIBUTE = 'data-translation-id'

class Translator {
  constructor(options) {
    if (!options.languages || !options.languages[DEFAULT_LANGUAGE]) {
      throw new Error(`default language "${DEFAULT_LANGUAGE}" missing`)
    }
    this.languages = options.languages
    this.detectLanguage()
  }

  /**
   * Simple string validation for the language code
   */
  validateLanguageKey(key) {
    return !!(
      typeof key === 'string'
      && key.length === 3
      && this.languages[key]
    )
  }

  getLocale(key) {
    const lang = key ? this.languages[key] : this.current
    return lang.codes['639-1'] || lang.codes['639-2']
  }

  /**
   * Set current language if given one is valid
   */
  setLanguage(key) {
    this.key = this.validateLanguageKey(key) ? key : 'eng'
    this.current = this.languages[this.key]
    window.localStorage.setItem(LOCAL_STORAGE_KEY, this.key)
    document.documentElement.lang = this.getLocale()
  }

  /**
   * Detect language from environment
   */
  detectLanguage() {
    let key

    // if language is defined in querystring, use that one
    const qs = window.location.search.substring(1)
    const m = /lang=([A-z]+)/i.exec(qs)
    if (m && m.length > 1) {
      key = m[1]

    // otherwise, check local storage 
    } else {
      key = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    }

    // this will validate the language in the setter
    // before saving
    this.setLanguage(key)
  }

  

  /**
   * Find elements with the `data-translation-id` attribute and replace
   * with translated term if one is available in current language
   */
  translate(el) {
    if (!el) el = document

    const els = el.querySelectorAll(`[${DATA_ATTRIBUTE}]`)f

    // convert NodeList to Array so we can use forEach
    // replace with translation wherever possible
    Array.prototype.slice.call(els).forEach(el => {
      const id = el.getAttribute(DATA_ATTRIBUTE)

      // skip if theres no id
      if (!id) return

      // get translated term and replace
      const term = this.getTerm(id)
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
  getTerm(id, fallback) {

    // if fallback isn't provided, use english translation
    if (!fallback && this.languages['eng']) {
      fallback = this.languages['eng'].terms[id] || ''
    }

    // if language isn't set return fallback
    if (!this.language) return fallback

    const term = this.language.terms[id]

    return term ? term : fallback
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

  getIcon(key) {
    const lang = key ? this.langages[key] || this.language
  }

  defineLocales(moment) {
    Object.keys(this.languages).forEach((key) => {

      const {
        relativeTime,
        codes
      } = this.languages[key]

      if (relativeTime) {
        const locale = codes['693-1'] || codes['693-2']
        if (!locale) return

        moment.defineLocale(locale, { relativeTime })
      }
    })
  }
}

export default Translator