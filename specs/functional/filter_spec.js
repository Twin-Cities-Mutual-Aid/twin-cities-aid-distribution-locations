import { Selector } from 'testcafe'
import { beforeEachTest, airtableHook } from '../helpers'

fixture `Filters`
  .page `http://localhost:8080/`
  .beforeEach(beforeEachTest)
  .requestHooks(airtableHook)

// Tapping one of the ✅'s in the legend filters items on the map and in the list.
test('Uncheck "closed" filter', async t => {
  await t.expect(Selector('.status-closed').exists).ok()

  // By default the filter for "closed" is set to true
  const listCount = await Selector('.location-list--item').count
  const closedCount = await Selector('.status-closed').count

  await t
    // make sure a couple items load first
    .expect(Selector('.status-closed').exists).ok()
    // Check that closed points show up on a map initially
    .expect(Selector('.status-closed').getStyleProperty('display')).eql('block')
    .expect(Selector('.mapboxgl-marker').filterVisible().count).eql(listCount)
    // Uncheck "closed" filter
    .click(Selector('label[for="filter-closed"]'))
    // closed points nolonger show up
    .expect(Selector('.status-closed').getStyleProperty('display')).eql('none')
    // "closed" items should be removed from the list
    .expect(Selector('.location-list--item').count).eql(listCount - closedCount)
    // "closed" items should be removed from the map
    .expect(Selector('.mapboxgl-marker').filterVisible().count).eql(listCount - closedCount)
})
