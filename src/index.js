// Import Styles
import 'mapbox-gl/dist/mapbox-gl.css'
import './styles/normalize.css'
import './styles/styles.css'
import './styles/welcome.css'
import './styles/translator.css'

// Import Libs
import mapboxgl from 'mapbox-gl'
import moment from 'moment'
import Config from './config'
import _ from 'lodash'
import Filter from './js/filter'
import Translator from './js/translator'
import WelcomeModal from './js/welcome'
import { TrackJS } from 'trackjs';

//Add TrackJS Agent
if(import.meta.env.MODE === 'production'){
  TrackJS.install({
    token: Config.trackJSToken
    // for more configuration options, see https://docs.trackjs.com
  });
}

//just for testing, will remove this before merging
TrackJS.track('Testing TrackJS!');

const $locationList = document.getElementById('location-list')
const $sidePane = document.getElementById('side-pane')
const $locationsButton = document.getElementById('locations-toggle-button');
const $body = document.body;

mapboxgl.accessToken = Config.accessToken

// we're using the map color from google sheet to indicate location status,
// but using a different display color for accessibility. so the original
// color is treated as an ID
const unknownStatus =   {
  id: '#aaaaaa',
  name: 'unknown',
  label: 'status unknown',
  accessibleColor: '#ffffbf'
}

const statusOptions = [
  {
    id: '#fc03df',
    name: 'recieving',
    label: 'open for receiving donations',
    accessibleColor: '#2c7bb6'
  },
  {
    id: '#03bafc',
    name: 'distributing',
    label: 'open for distributing donations',
    accessibleColor: '#abd9e9'
  },
  {
    id: '#9f48ea',
    name: 'both',
    label: 'open for both',
    accessibleColor: '#fdae61'
  },
  {
    id: '#c70000',
    name: 'closed',
    label: 'currently closed',
    accessibleColor: '#d7191c'
  },
  unknownStatus
]


let langs
// show all langs in dev mode
if (window.location.search.indexOf('dev') > -1) {
  langs = ['eng', 'spa', 'kar', 'som', 'hmn', 'amh', 'orm', 'vie']
// otherwise only show these
} else {
  langs = ['eng', 'spa', 'som', 'amh', 'orm', 'vie']
}

// initialize translator and load translations file
const translator = new Translator({ enabledLanguages: langs })
let welcome

// get the translation data and then run the translator
fetch(Config.translationUrl).then(async (resp) => {
  try {
    const data = await resp.json()

    // add translation definitions to translator
    translator.setTranslations(Translator.ParseGoogleSheetData(data))

    // create the welcome modal
    welcome = new WelcomeModal({
      languages: translator.availableLanguages,

      // when language is selected, run translation
      onLanguageSelect: lang => {
        translator.language = lang
        translator.translate()
      }
    })

    // show welcome modal if no language is selected
    if (!translator.language) {
      welcome.open()

    // otherwise just run translator
    } else {
      translator.translate()
    }

    // when language button is clicked, re-open welcome modal
    const languageButton = document.getElementById('lang-select-button')
    languageButton.addEventListener('click', () => welcome.open())

  } catch (e) {
    console.error('Translation error', e)
  }
})

let locations = []

// Alternative base style: 'mapbox://styles/mapbox/light-v10',
// See also: https://docs.mapbox.com/mapbox-gl-js/example/setstyle/
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/saman/ckawvg6bk011x1ipepu7nqlbh',
  zoom: 10,
  center: [-93.212471, 44.934473],
})

map.setPadding({ top: 300, bottom: 20, left: 20, right: 20 })

// Add zoom and rotate controls
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

// convert case
function camelToTitle(str) {
  const result = str.replace(/([A-Z])/g,' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

function truthy(str) {
  const normalizedStr = _.toUpper(str);
  return _.includes(['TRUE', 'YES', 'T', 'Y'], normalizedStr);
}

// open/close location sidebar
function toggleSidePane() {
  if ($body.classList.contains('list-active')) {
    $locationsButton.innerText = translator.get('show_list_button', 'Show list of locations')
    $body.classList.remove('list-active')
  } else {
    $locationsButton.innerText = translator.get('hide_list_button', 'Hide list of locations')
    $body.classList.add('list-active')
  }
}

// open/close help info
function toggleHelpInfo() {
  if (window.location.hash === '#help-info') {
    // this currently leaves a '#' at the end of the URL on close. there's definitely a
    // better solution out there, but this works even if it's not pretty
    window.location.hash = ''
  } else {
    window.location.hash = '#help-info'
  }
}

// close popups for all locations
function closePopups() {
  locations.forEach(location => {
    location.marker.getPopup().remove()
  })
}

function needsMoneyComponent(location) {
  if (!location.seekingMoney) return ''

  let link = '';
  if (location.seekingMoneyURL && location.seekingMoneyURL !== '') {
    link = `<a data-translation-id="seeking_money_link" href="${location.seekingMoneyURL}" target="_blank">DONATE NOW!</a>`;
  }
  return `<span  class="seekingMoney seeking-money location-list--badge"><span data-translation-id="seeking_money">Needs Money</span> ${link}</span>`;
}

function addressComponent(address) {
  return `<address><a href="https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(address)}" target="_blank">${address}</a></address>`;
}

// get the status info for a location using the color as ID, else default to unknown.
const getStatus = id => {
  const status = _.find(statusOptions, s => (s.id === id.toLowerCase()))
  return status || unknownStatus
}

// create an item for the side pane using a location
const createListItem = (location, status, lng, lat) => {
  const urgentNeed = location.urgentNeed ? `<p class="urgentNeed p location-list--important"><span data-translation-id="urgent_need">Urgent Need</span>: ${location.urgentNeed}</p>` : ''
  const seekingMoney = needsMoneyComponent(location);

  let seekingVolunteers = ''
  if (location.seekingVolunteers && location.seekingVolunteers.match(/(?:\byes\b)/i)) {
    seekingVolunteers = `<span data-translation-id="seeking_volunteers" class="seekingVolunteers location-list--badge">Needs Volunteer Support</span>`
  }

  const openTimeDistribution = moment(location.openingForDistributingDontations, ["h:mm A"])
  const openTimeDistributionLessOne = moment(location.openingForDistributingDontations, ["h:mm A"]).subtract(1, 'hours')
  let openingSoonForDistribution = ''
  if (moment().isBetween(openTimeDistributionLessOne, openTimeDistribution)) {
    openingSoonForDistribution = `<p class="opening-soon"><span data-translation-id="opening_soon">Opening soon!</span> ${openTimeDistribution.format("LT")} <span data-translation-id="for_distribution">for distributing</span></p>`
  }

  const openTimeReceiving = moment(location.openingForReceivingDontations, ["h:mm A"])
  const openTimeReceivingLessOne = moment(location.openingForReceivingDontations, ["h:mm A"]).subtract(1, 'hours')
  let openingSoonForReceiving = ''
  if (moment().isBetween(openTimeReceivingLessOne, openTimeReceiving)) {
    openingSoonForReceiving = `<p class="opening-soon"><span data-translation-id="opening_soon">Opening soon!</span> ${openTimeReceiving.format("LT")} <span data-translation-id="for_receiving">for receiving</span></p>`
  }

  const $item = document.createElement('div')
  $item.classList.add('location-list--item')
  $item.dataset.id = status.id;
  $item.innerHTML = `
    <div class="flex">
      <span title="${status.id}" class="status location-list--indicator" style="background-color: ${status.accessibleColor};">${status.id}</span>
      <div>
        <h2 class='h2'>
          <span class="name">${location.name}</span>
        </h2>
        <h3 class="h3 neighborhood">${location.neighborhood || ''}</h3>
        ${openingSoonForDistribution}
        ${openingSoonForReceiving}
        ${urgentNeed}
        ${seekingVolunteers}
        ${seekingMoney}
      </div>
    </div>
    `
  $item.addEventListener('click', (evt) => {
    const popup = location.marker.getPopup()
    if (popup.isOpen()) {
      popup.remove()
    } else {
      closePopups()
      toggleSidePane()
      map.jumpTo({
        center: popup.getLngLat(),
        essential: true,
        zoom: 13
      })
      console.log('popup', popup)
      popup.addTo(map)
      if (translator.language) translator.translate()
    }
  })
  return $item
}

//////////////////////////
// Protect against columns not yet existing in the spreadsheet.
// We can remove once they are added to the sheet.
function extractSeekingMoney(item) {
  try {
    return truthy(item.gsx$seekingmoney.$t);
  } catch (err) {
    console.info("Seeking Money Column does not exist yet.");
    return false;
  }
}

function extractSeekingMoneyURL(item) {
  try {
    return item.gsx$seekingmoneyurl.$t;
  } catch (err) {
    console.info("Seeking Money URL Column does not exist yet.");
    return '';
  }
}
//////////////////////////

function extractRawLocation(item) {
  return {
    name: item.gsx$nameoforganization.$t,
    neighborhood: item.gsx$neighborhood.$t,
    address: item.gsx$addresswithlink.$t,
    mostRecentlyUpdatedAt: item.gsx$mostrecentlyupdated.$t,
    seekingMoney: extractSeekingMoney(item),
    seekingMoneyURL: extractSeekingMoneyURL(item),
    currentlyOpenForDistributing: item.gsx$currentlyopenfordistributing.$t,
    openingForDistributingDontations: item.gsx$openingfordistributingdonations.$t,
    closingForDistributingDonations: item.gsx$closingfordistributingdonations.$t,
    accepting: item.gsx$accepting.$t,
    notAccepting: item.gsx$notaccepting.$t,
    currentlyOpenForReceiving: item.gsx$currentlyopenforreceiving.$t,
    openingForReceivingDontations: item.gsx$openingforreceivingdonations.$t,
    closingForReceivingDonations: item.gsx$closingforreceivingdonations.$t,
    seekingVolunteers: item.gsx$seekingvolunteers.$t,
    urgentNeed: item.gsx$urgentneed.$t,
    notes: item.gsx$notes.$t
  }
}

// start fetching data right away
const dataPromise = fetch(Config.dataUrl)

// handle the map load event
const onMapLoad = async () => {
  const resp = await dataPromise
  const data = await resp.json()

  // filter and transform data from google sheet
  locations = _.chain(data.feed.entry)
    .filter(item => (item.gsx$nameoforganization.$t != '') && (item.gsx$longitude.$t != '') && (item.gsx$latitude.$t != '')) // only items with names and lon,lat
    .sortBy(item => item.gsx$nameoforganization.$t )
    .map(item => {

      try {
        // the location schema
        const rawLocation = extractRawLocation(item);
        const location = _.pickBy(rawLocation, val => val != '');
        const status = getStatus(item.gsx$color.$t);

        // transform location properties into HTML
        const propertyTransforms = {
          name: (name, _) => `<h2 class='h2'>${name}</h2>`,
          neighborhood: (neighborhood, _) => `<h3 class='h3'>${neighborhood}</h3>`,
          address: addressComponent, // driving directions in google, consider doing inside mapbox
          seekingMoney: (value, location) => needsMoneyComponent(location),
          seekingMoneyURL: (value, _) => '',
          mostRecentlyUpdatedAt: (datetime, _) => `<div class='updated-at' title='${datetime}'><span data-translation-id='last_updated'>Last updated</span> ${moment(datetime, 'H:m M/D').fromNow()}</div>`
        }

        // render HTML for marker
        const markerHtml = _.map(location, (value, key) => {
          if (propertyTransforms[key]) return propertyTransforms[key](value, location)
          else return `<div class='p row'><p data-translation-id="${_.snakeCase(key)}"class='txt-deemphasize key'>${camelToTitle(key)}</p><p class='value'>${value}</p></div>`
        }).join('')

        // create marker
        location.marker = new mapboxgl.Marker({ color: status.accessibleColor })
          .setLngLat([ parseFloat(item.gsx$longitude.$t), parseFloat(item.gsx$latitude.$t) ])
          .setPopup(new mapboxgl.Popup().setMaxWidth('275px').setHTML(`<div class='popup-content'>${markerHtml}</div>`))
          .addTo(map);

          location.marker.getElement().className += " status-" + status.name;

          // run translation when popup opens
          const popup = location.marker.getPopup()
          popup.on('open', () => translator.translate(popup.getElement()))

          // add to the side panel
          $locationList.appendChild(createListItem(location, status, item.gsx$longitude.$, item.gsx$latitude.$))

          return location
        } catch (e) {
          console.error(e)
          return
        }
    }).value()

    // add nav
    const filter = new Filter($sidePane, {
      sortOptions: [
        {
          name: 'urgentNeed',
          label: 'Urgent requests first',
          sort: { order: 'desc' }
        },
        {
          name: 'name',
          label: 'Alphabetical (name)',
          sort: { order: 'asc' },
          selected: true
        },
        {
          name: 'status',
          label: 'Location status',
          sort: { order: 'desc' }
        },
        {
          name: 'neighborhood',
          label: 'Alphabetical (neighborhood)',
          sort: { order: 'asc' }
        },
        {
          name: 'seekingMoney',
          label: 'Needs money',
          sort: { order: 'desc' }
        },
        {
          name: 'seekingVolunteers',
          label: 'Needs volunteers',
          sort: { order: 'desc' }
        }
      ],
      statusOptions,
      onAfterUpdate: () => translator.translate()
    })

    // making sure to run translations after
    // everything else is loaded
    translator.translate()
}

// load map
map.on('load', onMapLoad)

// add sidebar-toggle-button handler
$locationsButton.addEventListener("click", function(){
  toggleSidePane()
});

// add help-toggle-button handler
const helpInfoOpenButton = document.getElementById('help-info-toggle-button')
helpInfoOpenButton.addEventListener("click", function(){
  toggleHelpInfo()
});

const helpInfoCloseButton = document.getElementById('help-info-close-button')
helpInfoCloseButton.addEventListener("click", function(){
  toggleHelpInfo()
});

// render key
const key = document.getElementById('key')
statusOptions.forEach(s => {
  const el = document.createElement('div');
  el.classList = ['legend--item'];
  el.innerHTML = `<span class="legend--item--swatch" style="background-color: ${s.accessibleColor}"></span>${s.label}`
  key.append(el)
})
