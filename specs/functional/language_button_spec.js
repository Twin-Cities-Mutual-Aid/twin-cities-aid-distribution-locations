import { Selector } from 'testcafe'
import { beforeEachTest } from '../helpers'

fixture `Language Selection`
  .page `http://localhost:8080/`
  .beforeEach(beforeEachTest)

// Changing the language to Spanish changes things on the page.
test('Switch language to Spanish', async t => {
  await t
    // Checks that the current selected language is English
    .expect(Selector('.lang-name').innerText).eql('English')
    .expect(Selector('.title').textContent).contains('Twin Cities Mutual Aid Map')
    .click('#lang-select-button')
    // Language selections should popup
    .expect(Selector('.welcome-message').visible).ok()
    .click(Selector('.welcome-lang-button').withText('Español'))
    // Selecting "Español" should switch the language to Spanish
    .expect(Selector('.lang-name').innerText).eql('Español')
    .expect(Selector('.title').textContent).contains('Mapa de Ayuda de las Ciudades Gemelas')
})

// Reloading the page should keep language preference
test('Check that language has been saved', async t => {
  await t
    .click('#lang-select-button')
    .expect(Selector('.welcome-message').visible).ok()
    .click(Selector('.welcome-lang-button').withText('Español'))
    .expect(Selector('.lang-name').innerText).eql('Español')

  await t
    // Reload the page
    .eval(() => location.reload(true))
  
  await t
    // Language should still be Spanish after reload
    .expect(Selector('.lang-name').innerText).eql('Español')
    .click('#lang-select-button')
    // Welcome modal should be translated
    .expect(Selector('.welcome-message').innerText).eql('¡Bienvenidos!')
})
