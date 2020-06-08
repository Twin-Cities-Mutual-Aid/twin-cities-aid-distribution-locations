import { Selector } from 'testcafe'
import { beforeEachTest } from '../helpers'

fixture `Help Window`
  .page `http://localhost:8080/`
  .beforeEach(beforeEachTest)

test('Opening and closing Help Window', async t => {
  await t
    .click('#help-info-toggle-button')
    // Help window should be visible after clicking Help/Info button
    .expect(Selector('#help-info').visible).ok()
    .click('#help-info-close-button')
    // Help window should *not* be visible after clicking the Close button
    .expect(Selector('#help-info').visible).notOk()
    .click('#help-info-toggle-button')
    // Help window should be visible after clicking Help/Info button
    .expect(Selector('#help-info').visible).ok()
    .click('#help-info-toggle-button')
    // Help window should *not* be visible after clicking Help/Info button again
    .expect(Selector('#help-info').visible).notOk();

});

