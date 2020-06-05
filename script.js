const $locationList = document.getElementById('location-list')
const $sidePane = document.getElementById('side-pane')
const $locationsButton = document.getElementById('locations-toggle-button');
const $body = document.body;


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

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    trackProximity: true,
    proximity: true,
    collapsed: true,
    clearAndBlurOnEsc: true,
    clearOnBlur: true,
    marker: false,
    flyTo: {}
  }), 'bottom-right'
)

// Add geolocate control to the map.
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  }), 'bottom-right'
)

// Add zoom and rotate controls
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

// convert case
function camelToTitle(str) {
  const result = str.replace(/([A-Z])/g,' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

// open/close location sidebar
function toggleSidePane() {
  if ($body.classList.contains('list-active')) {
    $locationsButton.innerText = 'Show list of locations'
    $body.classList.remove('list-active')
  } else {
    $locationsButton.innerText = 'Hide list of locations'
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

// get the status info for a location using the color as ID, else default to unknown.
const getStatus = id => {
  const status = _.find(statusOptions, s => (s.id === id.toLowerCase()))
  return status || unknownStatus
}

// create an item for the side pane using a location
const createListItem = (location, status, lng, lat) => {
  const urgentNeed = location.urgentNeed ? `<p class="urgentNeed p location-list--important">Urgent Need: ${location.urgentNeed}</p>` : ''
  const seekingMoney = location.seekingMoney ? `<span class="seekingMoney location-list--badge">Needs Money Donations</span>` : ''
  let seekingVolunteers = ''
  if (location.seekingVolunteers && location.seekingVolunteers.match(/(?:\byes\b)/i)) {
    seekingVolunteers = `<span class="seekingVolunteers location-list--badge">Needs Volunteer Support</span>`
  }

  const openTimeDistribution = moment(location.openingForDistributingDontations, ["h:mm A"])
  const openTimeDistributionLessOne = moment(location.openingForDistributingDontations, ["h:mm A"]).subtract(1, 'hours')
  let openingSoonForDistribution = ''
  if (moment().isBetween(openTimeDistributionLessOne, openTimeDistribution)) {
    openingSoonForDistribution = `<p class="opening-soon">Opening soon! ${openTimeDistribution.format("LT")} for distributing</p>`
  }

  const openTimeReceiving = moment(location.openingForReceivingDontations, ["h:mm A"])
  const openTimeReceivingLessOne = moment(location.openingForReceivingDontations, ["h:mm A"]).subtract(1, 'hours')
  let openingSoonForReceiving = ''
  if (moment().isBetween(openTimeReceivingLessOne, openTimeReceiving)) {
    openingSoonForReceiving = `<pclass="opening-soon">Opening soon! ${openTimeReceiving.format("LT")} for receiving</p>`
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
        <h3 class="h3 neighborhood">${location.neighborhood}</h3>
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
      popup.addTo(map)
    }
  })
  return $item
}

// start fetching data right away
const dataPromise = fetch(DATA_URL)

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
        const moneySearchStr = `${item.gsx$accepting.$t}, ${item.gsx$urgentneed.$t}, ${item.gsx$notes.$t}`.toLowerCase()
        const seekingMoney = moneySearchStr.includes('money') || moneySearchStr.includes('cash') || moneySearchStr.includes('venmo') || moneySearchStr.includes('monetary')
        // the location schema
        const rawLocation = {
          name: item.gsx$nameoforganization.$t,
          neighborhood: item.gsx$neighborhood.$t,
          address: item.gsx$addresswithlink.$t,
          mostRecentlyUpdatedAt: item.gsx$mostrecentlyupdated.$t,
          currentlyOpenForDistributing: item.gsx$currentlyopenfordistributing.$t,
          openingForDistributingDontations: item.gsx$openingfordistributingdonations.$t,
          closingForDistributingDonations: item.gsx$closingfordistributingdonations.$t,
          accepting: item.gsx$accepting.$t,
          notAccepting: item.gsx$notaccepting.$t,
          currentlyOpenForReceiving: item.gsx$currentlyopenforreceiving.$t,
          openingForReceivingDontations: item.gsx$openingforreceivingdonations.$t,
          closingForReceivingDonations: item.gsx$closingforreceivingdonations.$t,
          seekingVolunteers: item.gsx$seekingvolunteers.$t,
          seekingMoney: seekingMoney,
          urgentNeed: item.gsx$urgentneed.$t,
          notes: item.gsx$notes.$t
        }
        const location = _.pickBy(rawLocation, val => val != '')
        const status = getStatus(item.gsx$color.$t)

        // transform location properties into HTML
        const propertyTransforms = {
          name: (name) => `<h2 class='h2'>${name}</h2>`,
          neighborhood: (neighborhood) => `<h3 class='h3'>${neighborhood}</h3>`,
          address: (address) => `<address><a href="https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(address)}" target="_blank">${address}</a></address>`, // driving directions in google, consider doing inside mapbox
          mostRecentlyUpdatedAt: (datetime) => `<div class='updated-at' title='${datetime}'>Last updated ${moment(datetime, 'H:m M/D').fromNow()}</div>`
        }

        // render HTML for marker
        const markerHtml = _.map(location, (value, key) => {
          if (propertyTransforms[key]) return propertyTransforms[key](value)
          else return `<div class='p row'><p class='txt-deemphasize key'>${camelToTitle(key)}</p><p class='value'>${value}</p></div>`
        }).join('')

        // create marker
        location.marker = new mapboxgl.Marker({ color: status.accessibleColor })
          .setLngLat([ parseFloat(item.gsx$longitude.$t), parseFloat(item.gsx$latitude.$t) ])
          .setPopup(new mapboxgl.Popup().setMaxWidth('275px').setHTML(`<div class='popup-content'>${markerHtml}</div>`))
          .addTo(map);

          location.marker.getElement().className += " status-" + status.name;

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
    })
}

// load map
map.on('load', onMapLoad)

// render key
const key = document.getElementById('key')
statusOptions.forEach(s => {
  const el = document.createElement('div');
  el.classList = ['legend--item'];
  el.innerHTML = `<span class="legend--item--swatch" style="background-color: ${s.accessibleColor}"></span>${s.label}`
  key.append(el)
})
