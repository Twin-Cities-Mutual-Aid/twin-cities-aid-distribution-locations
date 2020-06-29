import { Selector, ClientFunction } from 'testcafe'

export const beforeEachTest = async t => {
  await t
    // Language must be selected before anything else can be done
    .click(Selector('.welcome-lang-button').withText('English'))
    // Help window should not be visible at beginning
    .expect(Selector('#help-info').visible).notOk()
}

export const getURL = ClientFunction(() => window.location.href)
