/**
 * Simple frontend i18n tool
 *
 * Using local translation files located under /src/i18n/*.js
 */

import eng from './../i18n/eng.js'
import spa from './../i18n/spa.js'
import som from './../i18n/som.js'
import hmn from './../i18n/hmn.js'
import amh from './../i18n/amh.js'
import orm from './../i18n/orm.js'
import oji from './../i18n/oji.js'
import dak from './../i18n/dak.js'
import vie from './../i18n/vie.js'

class Translator {
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

  /**
   * Get current or default language
   */
  getLanguageKey(lang) {
    if (lang && this.languages && this.languages[lang]) {
      return lang
    }
    return Translator.DEFAULT_LANGUAGE
  }

  /**
   * Set current language if given one is valid
   */
  set language(lang) {
    // If lang matches current language, return
    if (lang === this.lang) return

    lang = this.getLanguageKey(lang)
    this.lang = lang
    window.localStorage.setItem(Translator.LOCAL_STORAGE_KEY, lang)
    this.translations = this.languages[lang]
    this.locale = this.translations.locale

    this.setDocumentLanguage()
    this.translate()
  }

  /**
   * Get current language
   */
  get language() {
    const lang = window.localStorage.getItem(Translator.LOCAL_STORAGE_KEY)
    return this.getLanguageKey(lang)
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

    // If the language is not set as a query parameter
    // and
    // language is not set in localStore
    // prompt for choice
    if (!lang) this.prompt = true

    // this will validate the language in the setter before saving
    this.language = lang
  }

  /**
   * Find elements with the `data-translation-id` attribute and replace
   * with translated term if one is available in current language
   */
  translate(el) {
    if (!el) el = document

    this.els = el.querySelectorAll(`[data-translation-id]`)
    // convert NodeList to Array so we can use forEach
    const els = Array.prototype.slice.call(this.els)

    // replace with translation wherever possible
    els.forEach(el => {
      const id = el.getAttribute('data-translation-id')
      const term = this.get(id)
      // skip if theres no id, or no translation
      if (term && term.length) {
        if (el.placeholder) {
          el.placeholder = term
        } else {
          el.innerHTML = term
        }
      }
    })
  }

  /**
   * Get a translated term for the given id and current language.
   * Fallback is used if no translation is found.
   * If fallback is falsy, then just use English translation
   */
  get(id, fallback) {
    if (!id) return

    // if fallback isn't provided, use default translation
    if (!fallback) {
      fallback = this.languages[Translator.DEFAULT_LANGUAGE][id]
    }
    return this.translations[id] || fallback
  }

  /**
   * Sets language throughout the page
   * - Find and set images with the `data-translation-flag`
   * - Set <html lang="??">
   * - Send GA event to track language choice
   */
  setDocumentLanguage() {
    document.documentElement.lang = this.locale

    const els = document.querySelectorAll('img[data-translation-flag]')
    Array.prototype.slice.call(els).forEach(el => {
      el.src = `/images/lang-${this.language}.png`
      el.alt = this.get('lang_name')
    })

    gtag('event', 'language_change', {
      'event_category': 'language',
      'event_label': this.language
    })
  }
}

Translator.LOCAL_STORAGE_KEY = 'twma_lang'
Translator.DEFAULT_LANGUAGE = 'eng'

export default Translator
