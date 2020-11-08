// Import Styles
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/normalize.css';
import './styles/styles.css';
import './styles/welcome.css';
import './styles/translator.css';
import './styles/theme.css';
import './styles/components/location-card.css';
import './styles/components/map-popup.css';
import './styles/components/form-control.css';
import './styles/components/search.css';
import './styles/components/covid-banner.css';
import './styles/typography.css';

// Import Libs
import mapboxgl from 'mapbox-gl'
import moment from 'moment/dist/moment'
import Config from './config'
import _ from 'lodash'
import Filter from './js/filter'
import Translator from './js/translator'
import WelcomeModal from './js/welcome'
import { getQueryParam } from './js/url-helpers';
import { TrackJS } from 'trackjs';
import validate, { LOCATION_SCHEMA } from "./js/validator";
import replaceAll from 'string.prototype.replaceall'
import PullToRefresh from 'pulltorefreshjs'
import Airtable from 'airtable'

//Add TrackJS Agent
if(import.meta.env.MODE === 'production'){
  TrackJS.install({
    token: Config.trackJSToken
    // for more configuration options, see https://docs.trackjs.com
  });
}

// locales
import 'moment/dist/locale/es'
import 'moment/dist/locale/vi'
import './locale/am'
import './locale/dak'
import './locale/hmn'
import './locale/kar'
import './locale/man'
import './locale/oj'
import './locale/om'
import './locale/so'

const $locationList = document.getElementById('location-list')
const $sidePane = document.getElementById('side-pane')
const $locationsButton = document.getElementById('locations-toggle-button');
const $body = document.body;

mapboxgl.accessToken = Config.accessToken

// we're using the map color from google sheet to indicate location status,
// but using a different display color for accessibility. so the original
// color is treated as an ID
const statusClosed =  {
  id: '#c70000',
  name: 'closed',
  label: 'not open now',
  accessibleColor: '#d7191c',
  count: 0
}

const statusOptions = [
  {
    id: '#fc03df',
    name: 'receiving',
    label: 'open for receiving donations',
    accessibleColor: '#2c7bb6',
    count: 0
  },
  {
    id: '#03bafc',
    name: 'distributing',
    label: 'open for distributing donations',
    accessibleColor: '#abd9e9',
    count: 0
  },
  {
    id: '#9f48ea',
    name: 'both',
    label: 'open for both',
    accessibleColor: '#fdae61',
    count: 0
  },
  statusClosed
]

// initialize translator and load translations file
let activePopup
const translator = new Translator()
moment.locale(translator.locale)

const ptr = PullToRefresh.init({
  mainElement: "body",
  triggerElement: "#header",
  instructionsPullToRefresh: " ",
  iconArrow: " ",
  iconRefreshing: " ",
  instructionsRefreshing: '<h1><i class="fas fa-spinner fa-spin"></i></h1>',
  instructionsReleaseToRefresh: '<h1><i class="fas fa-spinner"></i></div>',
  instructionsPullToRefresh: '<h1><i class="fas fa-spinner"></i></h1>',
  onRefresh() {
    window.location.reload();
  }
});

const welcome = new WelcomeModal({
  languages: translator.languages,
  onLanguageSelect: lang => {
    translator.language = lang
    moment.locale(translator.locale)
    activePopup && activePopup.refreshPopup()
  }
})

if (translator.prompt) {
  welcome.open()
} else {
  // Translate welcome modal based on current on previously saved language
  translator.translate(welcome.el)
}

// when language button is clicked, re-open welcome modal
document.getElementById('lang-select-button').addEventListener('click', () => welcome.open())

document.getElementById('close-covid-banner-button').addEventListener('click', () => closeCovidBanner())

let locations = []
let sitesList = []

function loadSites(Config) {
  const base = new Airtable({ apiKey: Config.airtableApiKey }).base(Config.airtableBaseName)

  base('mutual_aid_locations')
    .select({sort: [{field: "org_name", direction: "asc"}]})
    .all((error, records) => {
      if (error) {
        console.log(error)
      }
      else {
        sitesList = sitesList.concat(records)
      }
    })
}
loadSites(Config)

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

map.addControl(
  new mapboxgl.GeolocateControl(
    {
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }), 'bottom-right'
);

// convert case
function camelToTitle(str) {
  const result = str.replace(/([A-Z])/g,' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

function truthy(str) {
  const normalizedStr = _.toUpper(str);
  return _.includes(['TRUE', 'YES', 'T', 'Y'], normalizedStr);
}

function closeCovidBanner() {
  const covidBanner = document.getElementById('covid-banner')
  covidBanner.style.display = "none"
  covidBanner.setAttribute("aria-hidden", true)
}

// open/close location sidebar
function toggleSidePane() {
  let translationId
  if ($body.classList.contains('list-active')) {
    translationId = 'show_list_button'
    $body.classList.remove('list-active')
  } else {
    translationId = 'hide_list_button'
    $body.classList.add('list-active')
  }
  const buttonText = translator.get(translationId)
  if (buttonText) {
    $locationsButton.innerText = buttonText
    $locationsButton.setAttribute('data-translation-id', translationId)
    $locationsButton.setAttribute('aria-label', buttonText)
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
    link = `<a data-translation-id="seeking_money_link" href="${location.seekingMoneyURL}" target="_blank" onclick="captureOutboundLink('${location.seekingMoneyURL}', 'donation')">DONATE NOW!</a>`;
  }
  return `<span class="seekingMoney seeking-money card-badge"><span data-translation-id="seeking_money">Needs Money</span> ${link}</span>`;
}

function addressComponent(address) {
  const googleMapDirections = `https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(address)}`
  return `<address><a href="${googleMapDirections}" target="_blank" onclick="captureOutboundLink('${googleMapDirections}', 'directions')">${address}</a></address>`;
}

// builds the section within the popup and replaces and URLs with links
function sectionUrlComponent(value, key) {
  let urls = extractUrls(value)
  let parsedText = parseLineBreaks(value)
  let sectionHTML = `
    <p class="p row">
      <p data-translation-id="${key}" class="txt-deemphasize key">
        ${key.toUpperCase()}
      </p>
      <p class="value">
        ${parsedText}
      </p>
    </p>
  `

  if (urls) {
    const distinctUrls = [...new Set(urls)];
    _.forEach(distinctUrls, url => {
      let target_url = url;
      if (!(/[a-z]/i.test(url))) target_url = 'tel:' + url.replace(/[^\d()-.]/g, '')
      else if (/[\w.%+-]@[\w.]+/.test(url)) target_url = 'mailto:' + url
      else if (!(/http/i.test(url))) target_url = 'http://' + url

      sectionHTML = replaceAll(sectionHTML, url, `<a href="${target_url}" target="_blank" onclick="captureOutboundLink('${target_url}', '${key}')">${url}</a>`);
    });
  }

  return sectionHTML
}

// get the status info for a location using the color as ID, else default to closed.
const getStatus = id => {
  // const status = _.find(statusOptions, s => (s.id === id.toLowerCase()))
  const status = _.find(statusOptions, s => (s.id === id))
  return status || statusClosed
}

// Not all the fields being searched on should be visible but need
// to be on the DOM in order for listjs to pick them up for search
const hiddenSearchFields = ['address', 'accepting', 'notAccepting', 'notes', 'seekingVolunteers']

// create an item for the side pane using a location
const createListItem = (location, status, lng, lat) => {
  const neighborhood = location.neighborhood ? `<h3 class="card-subtitle neighborhood">${location.neighborhood}</h3>` : '';

  const urgentNeed = location.urgentNeed ? `<p class="urgentNeed p card-urgent-need"><span data-translation-id="urgent_need">Urgent Need</span>: ${location.urgentNeed}</p>` : ''
  const seekingMoney = needsMoneyComponent(location);

  let seekingVolunteers = ''
  if (location.seekingVolunteers && location.seekingVolunteers.match(/(?:\byes\b)/i)) {
    seekingVolunteers = `<span data-translation-id="seeking_volunteers_badge" class="seekingVolunteersBadge card-badge">Needs Volunteer Support</span>`
  }

  let covid19Testing = ''
  if (location.notes && location.notes.match(/(?:\bcovid[ -]?(19)? testing\b)/i)) {
    covid19Testing = `<span data-translation-id="covid19-testing" class="covid19-testing card-badge">Covid-19 Testing Available</span>`
  }

  const openTimeDistribution = moment(location.openingForDistributingDontations, ["h:mm A"])
  const openTimeDistributionLessOne = moment(location.openingForDistributingDontations, ["h:mm A"]).subtract(1, 'hours')
  let openingSoonForDistribution = ''
  if (moment().isBetween(openTimeDistributionLessOne, openTimeDistribution)) {
    openingSoonForDistribution = `<p class="card-opening-soon"><span data-translation-id="opening_soon">Opening soon!</span> ${openTimeDistribution.format("LT")} <span data-translation-id="for_distribution">for distributing</span></p>`
  }

  const openTimeReceiving = moment(location.openingForReceivingDontations, ["h:mm A"])
  const openTimeReceivingLessOne = moment(location.openingForReceivingDontations, ["h:mm A"]).subtract(1, 'hours')
  let openingSoonForReceiving = ''
  if (moment().isBetween(openTimeReceivingLessOne, openTimeReceiving)) {
    openingSoonForReceiving = `<p class="card-opening-soon"><span data-translation-id="opening_soon">Opening soon!</span> ${openTimeReceiving.format("LT")} <span data-translation-id="for_receiving">for receiving</span></p>`
  }

 const hiddenSearch = hiddenSearchFields.map(field => `<p class="${field}" style="display:none">${location[field] || ''}</p>`).join('')

  const $item = document.createElement('div')
  $item.classList.add('card');
  $item.classList.add('location-list--item');
  $item.dataset.id = status.id;

  // Increments the total count 
  // for this status. 
  status.count++

  $item.innerHTML = `
    <div class="card-content">
      <div class="card-title">
        <span title="${status.id}" class="status" style="display:none;">${status.id}</span>
        <span title="${status.id}" class="card-status-indicator" style="background-color: ${status.accessibleColor};" ></span>
        <h2 class="name">
          ${location.name}
        </h2>
      </div>
      ${neighborhood ? neighborhood : ' '}
      <div class="card-badge-group">
        ${openingSoonForDistribution}
        ${openingSoonForReceiving}
        ${urgentNeed}
        ${seekingVolunteers}
        ${seekingMoney}
        ${hiddenSearch}
        ${covid19Testing}
      </div>
    </div>
    <div class="card-status-border" style="background-color: ${status.accessibleColor};"></div>
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
      popup.addTo(map)
    }
  })
  return $item
}

///////////
// returns a range of hours if opening or closing is provided
// e.g. "7:00 AM to 5:00 PM"
// else returns just the opening hours text
// e.g "not today", or "never"
///////////
function getHours(openingHours, closingHours) {
  if (openingHours && closingHours) {
    return openingHours + ' to ' + closingHours
  } else {
    return openingHours
  }
}

///////////
// returns a an array of urls as strings if there is a match otherwise null
// e.g. ['https://google.com']
///////////
function extractUrls(item) {
  // web URL regex source: https://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript
  const host_pattern = /(?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)/
  const path_pattern = /(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+/
  const end_pattern = /(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])/
  const web_pattern = host_pattern.source + path_pattern.source + end_pattern.source
  const phone_pattern = /(?:\d[^\sa-z]*){9,10}\d/
  // email regexp adapted from https://www.regular-expressions.info/email.html
  const email_pattern = /[\w.%+-]+@[\w.]+\.[a-z]{2,}/
  const url_pattern = new RegExp(
    /\b/.source // all URLs start after a word boundary
    + '('
    + web_pattern
    + '|' + phone_pattern.source
    + '|' + email_pattern.source
    + ')',
    'gi' // find all occurrences, case-insensitive
  )

  return item.match(url_pattern)
}

function parseLineBreaks(value) {
  return replaceAll(value, '\n', '<br />');
}

function extractRawLocation(item) {
  return {
    name: item.fields.org_name,
    neighborhood: item.fields.neighborhood_name,
    address: item.fields.address,
    mostRecentlyUpdatedAt: item.fields.last_updated,
    currentlyOpenForDistributing: item.fields.currently_open_for_distributing,
    aidDistributionHours: getHours(item.fields.opening_for_distributing_donations, item.fields.closing_for_distributing_donations),
    currentlyOpenForReceiving: item.fields.currently_open_for_receiving,
    aidReceivingHours: getHours(item.fields.opening_for_receiving_donations, item.fields.closing_for_receiving_donations),
    urgentNeed: item.fields.urgent_need,
    seekingMoney: item.fields.seeking_money,
    seekingMoneyURL: item.fields.seeking_money_url,
    accepting: item.fields.accepting,
    notAccepting: item.fields.not_accepting,
    seekingVolunteers: item.fields.seeking_volunteers,
    notes: item.fields.notes
  }
}

// start fetching data right away
// const dataPromise = fetch(Config.dataUrl)

// handle the map load event
const onMapLoad = async () => {
  // const resp = await dataPromise
  // const data = await resp.json()
  console.log(sitesList)

  locations = _.chain(sitesList)
    .filter(item => (item.fields.org_name !== '') && (item.fields.longitude !== undefined) && (item.fields.latitude !== undefined) && (item.fields.color !== undefined)) // sanity check for empty rows
    // .filter((item, i) => validate(item, LOCATION_SCHEMA, { sheetRow: i + 1 })) TODO: Is this filtering needed?
    .map(item => {

      try {
        // the location schema
        const rawLocation = extractRawLocation(item);
        const location = _.pickBy(rawLocation, val => val != '');
        const status = getStatus(item.fields.color);

        // transform location properties into HTML
        const propertyTransforms = {
          name: (name, _) => `<h2>${name}</h2>`,
          neighborhood: (neighborhood, _) => `<h3 class='h3'>${neighborhood}</h3>`,
          address: addressComponent, // driving directions in google, consider doing inside mapbox
          seekingMoney: (value, location) => needsMoneyComponent(location),
          seekingMoneyURL: (value, _) => '',
          accepting: (value, _) => sectionUrlComponent(value, 'accepting'),
          notAccepting: (value, _) => sectionUrlComponent(value, 'not_accepting'),
          seekingVolunteers: (value, _) => sectionUrlComponent(value, 'seeking_volunteers_badge'),
          mostRecentlyUpdatedAt: (datetime, _) => `<div class='updated-at' title='${datetime}'><span data-translation-id='last_updated'>Last updated</span> <span data-translate-font>${moment(datetime, 'H:m M/D').fromNow()}</span></div>`,
          urgentNeed: (value, _) => sectionUrlComponent(value,'urgent_need'),
          notes: (value, _) => sectionUrlComponent(value,'notes'),
          // ignore the following properties
          // marker and popup should not be rendered
          marker: () => '',
          popup: () => '',
        }

        // render HTML for marker
        const markerHtml = () => _.map(location, (value, key) => {
          if (value == undefined) {
            return ''
          } else if (propertyTransforms[key]) {
            return propertyTransforms[key](value, location)
          } else {
            return `<div class='p row'><p data-translation-id="${_.snakeCase(key)}"class='txt-deemphasize key'>${camelToTitle(key)}</p><p class='value'>${value}</p></div>`
          }
        }).join('')

        // create marker
        location.marker = new mapboxgl.Marker({ color: status.accessibleColor })
          .setLngLat([ item.fields.longitude, item.fields.latitude ])
          .setPopup(new mapboxgl.Popup().setMaxWidth('275px'))
          .addTo(map);

          location.marker.getElement().className += " status-" + status.name;
          location.popup = location.marker.getPopup()

          location.popup.refreshPopup = () => {
            activePopup = location.popup
            location.popup.setHTML(`<div class='popup-content'>${markerHtml()}</div>`)
            translator.translate(location.popup.getElement())
          }

          // run translation when popup opens
          location.popup.on('open', location.popup.refreshPopup)

          // add to the side panel
          $locationList.appendChild(createListItem(location, status, item.fields.longitude, item.fields.latitude))

          return location
        } catch (e) {
          console.error(e)
          return
        }
    }).value()

    // add nav
    new Filter($sidePane, {
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
          name: 'seekingVolunteersBadge',
          label: 'Needs volunteers',
          sort: { order: 'desc' }
        }
      ],
      statusOptions,
      searchOptions: {
        initialSearch: getQueryParam('search'),
        searchOn: [
          'name',
          'neighborhood', 
          'urgentNeed',
          ...hiddenSearchFields
        ],
      },
      locations,
      onAfterUpdate: () => translator.translate()
    })
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

// add help-close-button handler
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
