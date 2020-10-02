import { Selector, ClientFunction } from 'testcafe'

export const beforeEachTest = async t => {
  const welcomeExists = Selector('.welcome-message').exists
  const englishButtonExists = Selector('.welcome-lang-button').withText("English").exists
  const englishButton = Selector('.welcome-lang-button').withText("English")

  await t
    .expect(welcomeExists).ok()
    .expect(englishButtonExists).ok()
    // Language must be selected before anything else can be done
    .click(englishButton)
    // Help window should not be visible at beginning
    .expect(Selector('#help-info').visible).notOk()
}

export const getURL = ClientFunction(() => window.location.href)
