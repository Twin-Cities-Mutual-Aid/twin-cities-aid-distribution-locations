/* global gtag */

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
import './styles/components/hours-banner.css';
import './styles/components/cooling-banner.css';
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
import replaceAll from 'string.prototype.replaceall'
import PullToRefresh from 'pulltorefreshjs'

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
import 'moment/dist/locale/fr'
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

PullToRefresh.init({
  mainElement: "body",
  triggerElement: "#header",
  iconArrow: " ",
  iconRefreshing: " ",
  instructionsRefreshing: '<h1><i class="fas fa-spinner fa-spin"></i></h1>',
  instructionsReleaseToRefresh: '<h1><i class="fas fa-spinner"></i></div>',
  instructionsPullToRefresh: '<h1><i class="fas fa-spinner"></i></h1>',
  onRefresh() {
    window.location.reload();
  }
});

/**
 * set which languages to display
 * update the language choice when a user selects a new language
 * Send GA event to track language choice
 * if there's an active popup, re-display it after the welcome modal closes
 */
const welcome = new WelcomeModal({
  languages: translator.languages,
  onLanguageSelect: lang => {
    translator.language = lang
    moment.locale(translator.locale)
    gtag('event', 'language_change', {
      'event_category': 'language',
      'event_label': lang
    })
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

document.getElementById('close-hours-banner-button').addEventListener('click', () => closeHoursBanner())

document.getElementById('close-cooling-banner-button').addEventListener('click', () => closeCoolingBanner())

let locations = []

// Alternative base style: 'mapbox://styles/mapbox/light-v10',
// See also: https://docs.mapbox.com/mapbox-gl-js/example/setstyle/
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/saman/ckawvg6bk011x1ipepu7nqlbh',
  zoom: 10,
  center: [-93.212471, 44.934473],
})

map.setPadding({ top: 0, bottom: 100, left: 20, right: 20 })

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

function closeCovidBanner() {
  const covidBanner = document.getElementById('covid-banner')
  covidBanner.style.display = "none"
  covidBanner.setAttribute("aria-hidden", true)
}

function closeHoursBanner() {
  const hoursBanner = document.getElementById('hours-banner')
  hoursBanner.style.display = "none"
  hoursBanner.setAttribute("aria-hidden", true)
}

function closeCoolingBanner() {
  const hoursBanner = document.getElementById('cooling-banner')
  hoursBanner.style.display = "none"
  hoursBanner.setAttribute("aria-hidden", true)
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

function noIdNeededComponent(location) {
  if(location.noIdNeeded === true) {
    if (location.someInfoRequired === true) {
      return `<span data-translation-id="some_info_required" class="noIdNeeded card-badge">No ID Needed (some info required)</span>`
    } else {
        return `<span data-translation-id="no_id_needed" class="noIdNeeded card-badge">No ID Needed</span>`
    }
  } else {
    return ''
  }
}

function nameComponent(name) {
  return `<h2>${name}</h2>`
}

function warmingSiteComponent(location) {
  if (location.warmingSite === true) {
    return `<span data-translation-id="warming_site" class="warmingSite card-badge">Warm Up Here</span>`
  } else {
    return ''
  }
}

function addressComponent(address) {
  const googleMapDirections = `https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(address)}`
  return `<address><a href="${googleMapDirections}" target="_blank" onclick="captureOutboundLink('${googleMapDirections}', 'directions')">${address}</a></address>`;
}

function publicTransitComponent(location, title) {
  if(location.publicTransitOptions) {
    const options = location.publicTransitOptions
    let routes = ``
    options.forEach((option) => {
      routes += `
        <span class="sr-only">${option.altText}</span>  
        <div class="transit-route-option" aria-hidden="true">
          <i class="material-icons-round route-icon">${option.icon}</i>
          <h5 class="transit-route route-text" style="background-color: ${option.backgroundColor};">${option.routeName}</h5>
          <h5 class="route-text">${option.distance}</h5>
        </div>`
    })
    return getPopupSectionComponent(title, routes)
  }
}

// builds the section within the popup and replaces and URLs with links
function sectionUrlComponent(value, key) {
  let urls = extractUrls(value)
  let parsedText = parseLineBreaks(value)
  let sectionHTML = `
    <p class="p row">
      <p data-translation-id="${key}" class="key">
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

// get the status info for a location based on site open status, else default to closed.
function getStatus(item) {
  let name = ""
  if(item.currentlyOpenForDistributing === "yes") {
    if(item.currentlyOpenForReceiving === "yes") {
        name ="both"
    } else {
      name = "distributing"
    }
  } else if(item.currentlyOpenForReceiving === "yes") {
    name ="receiving"
  } 
  const status = _.find(statusOptions, s => (s.name === name))
  return status || statusClosed
}

// Not all the fields being searched on should be visible but need
// to be on the DOM in order for listjs to pick them up for search
const hiddenSearchFields = ['address', 'accepting', 'notes', 'seekingVolunteers']

const hiddenSearchComponent = (field, value) => (
  `<p class="${field}" style="display:none">${value || '' }</p>`
)

// create an item for the side pane using a location
const createListItem = (location, status) => {
  const neighborhood = location.neighborhood ? `<h3 class="card-subtitle neighborhood">${location.neighborhood}</h3>` : '';

  const urgentNeed = location.urgentNeed ? `<p class="urgentNeed p card-urgent-need"><span data-translation-id="urgent_need">Urgent Need</span>: ${location.urgentNeed}</p>` : ''
  const seekingMoney = needsMoneyComponent(location);

  let seekingVolunteers = ''
  if (location.seekingVolunteers && location.seekingVolunteers.match(/(?:\byes\b)/i)) {
    seekingVolunteers = `<span data-translation-id="seeking_volunteers_badge" class="seekingVolunteersBadge card-badge">Needs Volunteer Support</span>`
  }

  const noIdNeeded = noIdNeededComponent(location)

  const warmingSite = warmingSiteComponent(location)

  let covid19Testing = ''
  if (location.notes && location.notes.match(/(?:\bcovid[ -]?(19)? testing\b)/i)) {
    covid19Testing = `<span data-translation-id="covid19-testing" class="covid19-testing card-badge">Covid-19 Testing Available</span>`
  }

  const openTimeDistribution = moment(location.openingForDistributingDonations, ["h:mm A"])
  const openTimeDistributionLessOne = moment(location.openingForDistributingDonations, ["h:mm A"]).subtract(1, 'hours')
  let openingSoonForDistribution = ''
  if (moment().isBetween(openTimeDistributionLessOne, openTimeDistribution)) {
    openingSoonForDistribution = `<p class="card-opening-soon"><span data-translation-id="opening_soon">Opening soon!</span> ${openTimeDistribution.format("LT")} <span data-translation-id="for_distribution">for distributing</span></p>`
  }

  const openTimeReceiving = moment(location.openingForReceivingDonations, ["h:mm A"])
  const openTimeReceivingLessOne = moment(location.openingForReceivingDonations, ["h:mm A"]).subtract(1, 'hours')
  let openingSoonForReceiving = ''
  if (moment().isBetween(openTimeReceivingLessOne, openTimeReceiving)) {
    openingSoonForReceiving = `<p class="card-opening-soon"><span data-translation-id="opening_soon">Opening soon!</span> ${openTimeReceiving.format("LT")} <span data-translation-id="for_receiving">for receiving</span></p>`
  }
  
  const publicTransitHiddenSearchComponent = hiddenSearchComponent('publicTransitOptions', JSON.stringify(location['publicTransitOptions'] ))	 

  let hiddenSearch = hiddenSearchFields.map(field => hiddenSearchComponent(field, location[field])).join('') + publicTransitHiddenSearchComponent

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
        <span class="status" style="display:none;">${status.id}</span>
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
        ${noIdNeeded}
        ${warmingSite}
        ${hiddenSearch}
        ${covid19Testing}
      </div>
    </div>
    <div class="card-status-border" style="background-color: ${status.accessibleColor};"></div>
  `

  
  $item.addEventListener('click', () => {
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
      gtag('event', 'open_site_popup', {
        'event_category': 'Site Interaction',
        'event_label': location.name
      })
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
function getOpenHoursComponent(openingHours, closingHours, key) {
  if(openingHours === "never" || openingHours === "not today") {
      return getPopupSectionComponent(key, openingHours)
  } else {
    let openHours = ``
    for (let i = 0; i < closingHours.length; i++) {
      openHours += `
        <p><span>${openingHours[i]}</span> to <span>${closingHours[i]}</span></p>`
    }
    return getPopupSectionComponent(key, openHours)
  }
}

///////////
// returns a an array of urls as strings if there is a match otherwise null
// e.g. ['https://google.com']
///////////
function extractUrls(item) {
  // web URL regex source: https://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript
  const host_pattern = /(?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)/
  const path_pattern = /(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+/
  const end_pattern = /(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()[\]{};:'".,<>?«»“”‘’])/
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

const getPopupSectionComponent = (title, content) => ( 
  `<div class='p row'><p data-translation-id="${_.snakeCase(title)}"class='key'>${camelToTitle(title)}</p><p class='value'>${content}</p></div>`
)

const request = fetch('https://tcmap-api.herokuapp.com/v1/mutual_aid_sites')

// handle the map load event
const onMapLoad = async () => {
  const resp = await request
  const data = await resp.json()

  locations = _.chain(data).map(item => {
    try {
      const location = _.pickBy(item, val => val != '');
      const status = getStatus(item);

      // transform location properties into HTML
      const propertyTransforms = {
        name: (name) => nameComponent(name),
        neighborhood: (neighborhood) => `<h3 class='h3'>${neighborhood}</h3>`,
        address: addressComponent, // driving directions in google, consider doing inside mapbox
        openingForDistributingDonations: (_, location) => getOpenHoursComponent(location.openingForDistributingDonations, location.closingForDistributingDonations, 'aidDistributionHours'),
        openingForReceivingDonations: (_, location) => getOpenHoursComponent(location.openingForReceivingDonations, location.closingForReceivingDonations, 'aidReceivingHours'),
        seekingMoney: (value, location) => needsMoneyComponent(location),
        seekingMoneyURL: () => '',
        noIdNeeded: (_, location) => noIdNeededComponent(location),
        someInfoRequired: () => '',
        warmingSite: (_, location) => warmingSiteComponent(location),
        publicTransitOptions: (_, location) => publicTransitComponent(location, 'publicTransit'),
        accepting: (value) => sectionUrlComponent(value, 'accepting'),
        notAccepting: (value) => sectionUrlComponent(value, 'not_accepting'),
        seekingVolunteers: (value) => sectionUrlComponent(value, 'seeking_volunteers_badge'),
        mostRecentlyUpdatedAt: (datetime) => `<div class='updated-at' title='${datetime}'><span data-translation-id='last_updated'>Last updated</span> <span data-translate-font>${moment(datetime, 'YYYY-MM-DDTHH:mm:ss.SSSZ').fromNow()}</span></div>`,
        urgentNeed: (value) => sectionUrlComponent(value,'urgent_need'),
        notes: (value) => sectionUrlComponent(value,'notes'),
        // ignore the following properties
        marker: () => '',
        popup: () => '',
        latitude: () => '',
        longitude: () => '',
        color: () => '',
        closingForDistributingDonations: () => '',
        closingForReceivingDonations: () => '',
      }

      // render HTML for marker
      const markerHtml = () => _.map(location, (value, key) => {
        if (value == undefined) {
          return ''
        } else if (propertyTransforms[key]) {
          return propertyTransforms[key](value, location)
        } else {
          return getPopupSectionComponent(key, value)
        }
      }).join('')

      // create marker
      location.marker = new mapboxgl.Marker({ color: status.accessibleColor })
        .setLngLat([ item.longitude, item.latitude ])
        .setPopup(new mapboxgl.Popup().setMaxWidth('275px'))
        .addTo(map);

      location.marker.getElement().className += " status-" + status.name;
      location.popup = location.marker.getPopup()

      location.popup.refreshPopup = () => {
        activePopup = location.popup
        map.flyTo({
          center: [ item.longitude, item.latitude]
        })
        location.popup.setHTML(`<div class='popup-content'>${markerHtml()}</div>`)
        translator.translate(location.popup.getElement())
      }

      // run translation when popup opens
      location.popup.on('open', location.popup.refreshPopup)

      // add to the side panel
      $locationList.appendChild(createListItem(location, status, item.longitude, item.latitude))
      
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
      },
      {
        name: 'noIdNeeded',
        label: 'No ID needed',
        sort: { order: 'desc' }
      },
      {	
        name: 'warmingSite',	
        label: 'Warming site',	
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
        'noIdNeeded',
        'warmingSite',
        'publicTransitOptions',
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
