const $locationList = document.getElementById('location-list')
const $sidePane = document.getElementById('side-pane')


// we're using the map color from google sheet to indicate location status,
// but using a different display color for accessibility. so the original
// color is treated ad an ID
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
    label: 'confirmed closed',
    accessibleColor: '#d7191c'
  },
  {
    id: '#aaaaaa',
    name: 'unknown',
    label: 'status unknown',
    accessibleColor: '#ffffbf'
  }
]

let locations = []

// Alternative base style: 'mapbox://styles/mapbox/light-v10',
// See also: https://docs.mapbox.com/mapbox-gl-js/example/setstyle/
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/saman/ckawvg6bk011x1ipepu7nqlbh',
  zoom: 10,
  center: [-93.212471, 44.934473]
})

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
  })
)

// Add geolocate control to the map.
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  })
)


// convert case
function camelToTitle(str) {
  const result = str.replace(/([A-Z])/g,' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

// open/close sidebar
function toggleSidePane($burger) {
  if ($sidePane.classList.contains('active')) {
    $sidePane.classList.remove('active')
  } else {
    $sidePane.classList.add('active')
  }
}

// close popups for all locations
function closePopups() {
  locations.forEach(location => {
    location.marker.getPopup().remove()
  })
}

// get the status info for a location using the color as ID
const getStatus = id => _.find(statusOptions, s => (s.id === id.toLowerCase()))

// create an item for the side pane using a location
const createListItem = (location, status, lng, lat) => {
  const urgentNeed = location.urgentNeed ? `<h3 class="urgentNeed" style="color: #f00; font-size: 80%">Urgent Need: ${location.urgentNeed}</h3>` : ''
  const seekingMoney = location.seekingMoney ? `<h3 class="seekingMoney" style="color: #f00; font-size: 80%">Needs Money Donations</h3>` : ''
  const seekingVolunteers = location.seekingVolunteers ? `<h3 class="seekingVolunteers" style="color: #f00; font-size: 80%">Needs Volunteer Support</h3>` : ''
  const $item = document.createElement('div')
  $item.classList.add('card')
  $item.innerHTML = `
    <div class="container">
      <h2 style="color: #444; font-size: 120%">
        <span class="status indicator" style="background-color: ${status.accessibleColor}; margin-right: 10px">${status.id}</span>
        <span class="name">${location.name}</span>
      </h2>
      <h3 class="neighborhood" style="color: #aaa; font-size: 80%">${location.neighborhood}</h3>
      ${urgentNeed}
      ${seekingVolunteers}
      ${seekingMoney}
    </div>
  `
  $item.addEventListener('click', (evt) => {
    const popup = location.marker.getPopup()
    if (popup.isOpen()) {
      popup.remove()
    } else {
      closePopups()
      $sidePane.classList.remove('active')
      popup.addTo(map)
      map.flyTo({
        center: [ parseFloat(lng), parseFloat(lat) ],
        essential: true,
        zoom: 13
      })
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
          notes: item.gsx$notes.$t,
          mostRecentlyUpdatedAt: item.gsx$mostrecentlyupdated.$t
        }
        const location = _.pickBy(rawLocation, val => val != '')
        const status = getStatus(item.gsx$color.$t)

        if (!status) {
          throw new Error("Malformed data for "+location.name+", could not find status: "+item.gsx$color.$t)
        }

        // transform location properties into HTML
        const propertyTransforms = {
          name: (name) => `<h1>${name}</h1>`,
          neighborhood: (neighborhood) => `<h2>${neighborhood}</h2>`,
          address: (address) => `<h3><a href="https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(address)}" target="_blank">${address}</a></h3>` // driving directions in google, consider doing inside mapbox
        }

        // render HTML for marker
        const markerHtml = _.map(location, (value, key) => {
          if (propertyTransforms[key]) return propertyTransforms[key](value)
          else return `<div><strong>${camelToTitle(key)}: </strong>${value}</div>`
        }).join('')

        // create marker
        location.marker = new mapboxgl.Marker({ color: status.accessibleColor })
          .setLngLat([ parseFloat(item.gsx$longitude.$t), parseFloat(item.gsx$latitude.$t) ])
          .setPopup(new mapboxgl.Popup().setMaxWidth('250px').setHTML(markerHtml))
          .addTo(map);

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
    map.addControl(new mapboxgl.NavigationControl());
}

// load map
map.on('load', onMapLoad)

// render key
const key = document.getElementById('key')
statusOptions.forEach(s => {
  const el = document.createElement('div')
  el.innerHTML = `<span class="legend-key" style="background-color: ${s.accessibleColor}"></span>${s.label}`
  key.append(el)
})
