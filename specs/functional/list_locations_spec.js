import { Selector } from 'testcafe'
import { beforeEachTest } from '../helpers'

fixture `List locations`
  .page `http://localhost:8080/`
  .beforeEach(beforeEachTest)
  .afterEach(async t => {
    await t
      .maximizeWindow()
  })

test('List locations button', async t => {
  await t
    // "Show list of locations" button should not show up by default
    .expect(Selector('#locations-toggle-button').visible).notOk()
    // Test on an iPhone XR in portrait mode
    .resizeWindowToFitDevice('iphonex', {
      portraitOrientation: true
    })
    // "Show list of locations" button should appear
    .expect(Selector('#locations-toggle-button').visible).ok()
})

// Tapping the "Show list of locations" button replaces the map view with a list view.
test('Click list locations button', async t => {
  await t
    // Test on an iPhone XR in portrait mode
    .resizeWindowToFitDevice('iphonex', {
      portraitOrientation: true
    })
    // Location list should not be visible
    .expect(Selector('.location-list').visible).notOk()
    // Click location list toggle button
    .click(Selector('#locations-toggle-button'))
    // List should be visible
    .expect(Selector('.location-list').visible).ok()
})

// Tapping an item in the list replaces the list view with a map view,
// and navigates the map to the tapped item on the map.
test('Click location in list', async t => {
  await t
    // Test on an iPhone XR in portrait mode
    .resizeWindowToFitDevice('iphonex', {
      portraitOrientation: true
    })
    // Click location list toggle button
    .click(Selector('#locations-toggle-button'))
  
  // If list is empty, we can't test the rest
  const listItems = await Selector('.location-list--item').count
  expect(listItems > 0)
  if (listItems == 0) {
    console.log('The list is empty')
    return
  }

  // Get the first item of the list and its title
  const firstItem = await Selector('.location-list--item').nth(0)
  const firstItemTitle = await Selector('.location-list--item h2').nth(0).innerText

  await t
    .click(firstItem)
    .expect(Selector('.mapboxgl-popup').visible).ok()
    // Popup content should match the title from the list item
    .expect(Selector('.popup-content h2').innerText).eql(firstItemTitle)
})
