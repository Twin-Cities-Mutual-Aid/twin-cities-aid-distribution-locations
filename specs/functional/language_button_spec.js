import { Selector } from 'testcafe'
import { beforeEachTest } from '../helpers'

fixture `Language Selection`
  .page `http://localhost:8080/`
  .beforeEach(beforeEachTest)

// Changing the language to Spanish changes things on the page.
test('Switch language to Spanish and check it is saved after reload', async t => {
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
  
  // await t.wait(2000);
  await t.eval(() => location.reload())
  await t.wait(3000)
  await t
    .expect(Selector('.lang-name').innerText).eql('Español')
    .click('#lang-select-button')
    // Welcome modal should be translated
    .expect(Selector('.welcome-message').innerText).eql('¡Bienvenidos!')
})
