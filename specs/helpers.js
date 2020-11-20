import { Selector, ClientFunction, RequestHook } from 'testcafe'
import dotenv from 'dotenv'

export const beforeEachTest = async t => {
  await t
    .wait(3000)
    // Language must be selected before anything else can be done
    .click(Selector('.welcome-lang-button').withText('English'))
    // Help window should not be visible at beginning
    .expect(Selector('#help-info').visible).notOk()
}

export const getURL = ClientFunction(() => window.location.href)

class airtableBearer extends RequestHook {
  constructor(env) {
    super(/api\.airtable\.com/, /api\.airtable\.com/)
    this.env = dotenv.config({path: '.env-test'}).parsed
  }

  onRequest(evt) {
    evt.requestOptions.headers['authorization'] = `Bearer ${this.env.SNOWPACK_PUBLIC_AIRTABLE_API_KEY}`
  }

}
export const airtableHook = new airtableBearer()
