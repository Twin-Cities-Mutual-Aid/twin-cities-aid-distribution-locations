

class WelcomeModal {
  constructor(options) {
    this.languages = options.languages
    this.onLanguageSelect = options.onLanguageSelect || (() => {})

    this.el = document.createElement('div')
    this.el.className = 'modal-wrap'
    this.el.innerHTML = this.render(this.languages)
    this.langButtons = this.el.querySelectorAll('.language-button')

    Array.prototype.slice.call(this.langButtons).forEach(b => {
      b.addEventListener('click', evt => {
        evt.preventDefault()
        const lang = b.value
        this.onLanguageSelect(lang)
        this.close()
      })
    })
  }

  render(languages) {

    const buttons = languages.map(l => `<button class="language-button" value="${l.name}">${l.label}</button>`).join('')

    return `
      <div class="modal">
        <h1>Welcome!</h1>
        <p>Please select a language:</p>
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