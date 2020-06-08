import { Selector } from 'testcafe'
import { beforeEachTest } from '../helpers'

fixture `Filters`
  .page `http://localhost:8080/`
  .beforeEach(beforeEachTest)
  
// Tapping one of the ✅'s in the legend filters items on the map and in the list.
test('Select "unknown" filter', async t => {
  // By default the filter for "unknown" is set to false
  const listCount = await Selector('.location-list--item').count
  const unknownCount = await Selector('.status-unknown').count
  if (unknownCount == 0) {
    return
  }

  // This will have to change if we switch to drawing the map with canvas
  await t
    // Check that unknown points don't show up on a map
    .expect(Selector('.status-unknown').getStyleProperty('display')).eql('none')
    .expect(Selector('.mapboxgl-marker').filterVisible().count).eql(listCount)
    // Select "unknown" filter
    .click(Selector('label[for="filter-unknown"]'))
    // unknown points should show up now
    .expect(Selector('.status-unknown').getStyleProperty('display')).eql('block')
    // "unknown" items should be added to the list
    .expect(Selector('.location-list--item').count).eql(listCount + unknownCount)
    // "unknown" items should be showing up on the map
    .expect(Selector('.mapboxgl-marker').filterVisible().count).eql(listCount + unknownCount)
})
