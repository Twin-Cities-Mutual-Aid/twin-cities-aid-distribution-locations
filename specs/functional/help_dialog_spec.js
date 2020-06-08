import { Selector } from 'testcafe';

fixture `Help Window`
  .page `http://localhost:8080/`
  .beforeEach( async t => {
    await t
      // Language must be selected before anything else can be done
      .click(Selector('.welcome-lang-button').withText('English'))
      // Help window should not be visible at beginning
      .expect(Selector('#help-info').visible).notOk();
  });

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

