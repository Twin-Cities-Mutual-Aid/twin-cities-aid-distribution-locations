/**
 * WelcomeModal is a modal window that allows users to choose their preferred language
 */
class WelcomeModal {
  constructor(options) {
    this.languages = options.languages
    this.onLanguageSelect = options.onLanguageSelect || (() => { })

    this.el = document.createElement('div')
    this.el.className = 'modal-wrap'
    this.el.innerHTML = this.render(this.languages)
    this.langButtons = this.el.querySelectorAll('.welcome-lang-button')

    // add event listeners to each button
    Array.prototype.slice.call(this.langButtons).forEach(b => {
      b.addEventListener('click', evt => {
        evt.preventDefault()
        this.onLanguageSelect(b.value)
        this.close()
      })
    })
  }

  // render the modal html
  render(languages) {
    const buttons = Object.keys(languages).map(key => {
      const { lang_name } = languages[key]
      return `<button class="welcome-lang-button" value="${key}"><img class="lang-flag-white" alt="${lang_name}" src="/images/lang-all-white.png">${lang_name}</button>`
    }).join('')

    return `
      <div class="modal">
        <h1 class="welcome-message" data-translation-id="welcome">Welcome!</h1>
        <p data-translation-id="welcome_blurb">Twin Cities Mutual Aid is an up to date resource on mutual aid sites in the Twin Cities.</p>
        <p class="bold"><span data-translation-id="lang_select">Please select a language</span>:</p>
        <div class="modal-languages">
          ${buttons}
        </div>
      </div>
    `
  }

  open() {
    document.body.appendChild(this.el)
  }

  close() {
    this.el.remove()
  }
}

export default WelcomeModal
