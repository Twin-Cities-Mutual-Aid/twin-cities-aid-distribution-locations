const $locationList = document.getElementById('location-list')
const $sidePane = document.getElementById('side-pane')
const $button = document.getElementById('toggle-button');
const $body = document.body;

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

// open/close sidebar
function toggleSidePane() {
  if ($body.classList.contains('list-active')) {
    $button.innerText = 'Show list of locations'
    $body.classList.remove('list-active')
  } else {
    $button.innerText = 'Hide list of locations'
    $body.classList.add('list-active')
  }
}

// get the status info for a location using the color as ID
const getStatus = id => _.find(statusOptions, s => (s.id === id.toLowerCase()))

let popup;
function updatePopup(feature) {
  if (popup) {
    popup.remove();
  }
  popup = new mapboxgl.Popup({ offset: 15, maxWidth: '275px' })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(`<div class='popup-content'>${getPopupContent(feature)}</div>`)
    .addTo(map);
}

// create an item for the side pane using a location
const createListItem = (f) => {
  const urgentNeed = f.properties.urgentNeed ? `<p class="urgentNeed p location-list--important">Urgent Need: ${f.properties.urgentNeed}</p>` : ''
  const seekingMoney = f.properties.seekingMoney === 'yes' ? `<span class="seekingMoney location-list--badge">Needs Money Donations</span>` : ''
  const seekingVolunteers = f.properties.seekingVolunteers ? `<span class="seekingVolunteers location-list--badge">Needs Volunteer Support</span>` : ''
  const $item = document.createElement('div')
  $item.classList.add('location-list--item')
  $item.innerHTML = `
    <div class="flex">
      <span title="${f.properties._status.id}" class="status location-list--indicator" style="background-color: ${f.properties._status.accessibleColor};">${f.properties._status.id}</span>
      <div>
        <h2 class='h2'>
          <span class="name">${f.properties.name}</span>
        </h2>
        <h3 class="h3 neighborhood">${f.properties.neighborhood}</h3>
        ${urgentNeed}
        ${seekingVolunteers}
        ${seekingMoney}
      </div>
    </div>
    `

  $item.addEventListener('click', (evt) => {
    // Add popup
    const feature = f;
    updatePopup(feature);

    // Show map if not visible
    toggleSidePane()

    // Center map on popup
    map.jumpTo({
      center: feature.geometry.coordinates,
      zoom: 14
    })
  })
  return $item
}

// start fetching data right away
const dataPromise = fetch(DATA_URL)

async function addMapImages() {
  let count = statusOptions.length;
  return new Promise((resolve, reject) => {

    statusOptions.forEach(o => {
      map.loadImage(`./images/${o.id.substring(1)}.png`, (err, img) => {
        if (err) throw err;
        map.addImage(o.id, img);

        count--;
        if (count === 0) {
          resolve();
        }

      });
    });

  });
}

function addSymbolLayer(els, geoJSON) {
  map.addSource('locations', { 
    type: 'geojson',
    data: geoJSON,
  });

  map.addLayer({
    'id': 'locations',
    'type': 'symbol',
    'source': 'locations',
    'paint': {
      'text-color': 'black',
      'text-halo-color': 'white',
      'text-halo-width': 2.5
    },
    'layout': {
      'symbol-sort-key': ['get', '_priorityRank'], // locations with urgent need get placement priority
      'icon-image': ['get', '_id'],
      'icon-size': .6,
      'icon-padding': 0,
      'text-size': 13,
      'text-field': ['get', 'name'],
      'text-font': ['Arial Unicode MS Bold'],
      'text-radial-offset': 1.2,
      'text-anchor': 'top',
      'text-justify': 'auto',
      'text-padding': 0,
      'text-optional': true,
      'icon-allow-overlap': true
    }
  });
}

function prepData(items) { 
  return _.chain(items)
    .filter(item => (item.gsx$nameoforganization.$t != '') && (item.gsx$longitude.$t != '') && (item.gsx$latitude.$t != '')) // only items with names and lon,lat
    .sortBy(item => item.gsx$nameoforganization.$t)
    .value();
}

function getPopupContent(featureData) { 
  // transform location properties into HTML
  const propertyTransforms = {
    name: (name) => `<h2 class='h2'>${name}</h2>`,
    neighborhood: (neighborhood) => `<h3 class='h3'>${neighborhood}</h3>`,
    address: (address) => `<address><a href="https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(address)}" target="_blank">${address}</a></address>`
  }

  // render HTML for marker
  return _.map(featureData.properties, (value, key) => {
    if (propertyTransforms[key]) return propertyTransforms[key](value);
    if (key.charAt(0) === '_') return; // skip private properties used for map rendering
    else return `<div class='p row'><p class='txt-deemphasize key'>${camelToTitle(key)}</p><p class='value'>${value}</p></div>`
  }).join('')
}

function getIsSeekingMoney(el) {
  const moneySearchStr = `${el.gsx$accepting.$t}, ${el.gsx$urgentneed.$t}, ${el.gsx$notes.$t}`.toLowerCase()
  const seekingMoney = moneySearchStr.includes('money') || moneySearchStr.includes('cash') || moneySearchStr.includes('venmo') || moneySearchStr.includes('monetary')
  return seekingMoney ? 'yes' : 'no';
}

function toGeoJson(data) {
  return {
    'type': 'FeatureCollection',
    'features': data.map(item => {

      const properties = {
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
        seekingMoney: getIsSeekingMoney(item),
        urgentNeed: item.gsx$urgentneed.$t,
        notes: item.gsx$notes.$t,
        mostRecentlyUpdatedAt: item.gsx$mostrecentlyupdated.$t,
        // Private
        _id: item.gsx$color.$t,
        _priorityRank: item.gsx$urgentneed.$t ? 0 : 1
      }

      // Delete empty values
      Object.keys(properties).forEach(p => {
        if (properties[p] === '') delete properties[p];
      });

    try {
      const status = getStatus(properties._id);
      properties._status = status;
    } catch(e) { 
      throw new Error("Malformed data for " + properties.name + ", could not find status: " + properties.color)
    }

    return {
        'type': 'Feature',
        'properties': properties,
      'id': item.name,
        'geometry': {
          'type': "Point",
          'coordinates': [parseFloat(item.gsx$longitude.$t), parseFloat(item.gsx$latitude.$t)]
        }
      };
    })
  }
}

function buildList(geoJSON) {
  geoJSON.features.forEach(f => { 
    $locationList.appendChild(createListItem(f, f.properties._status))
  });
}

// handle the map load event
const onMapLoad = async () => {
  const resp = await dataPromise
  const data = await resp.json().then(d => prepData(d.feed.entry));
  const geoJSON = toGeoJson(data);
  await addMapImages();
  addSymbolLayer(data, geoJSON);
  buildList(geoJSON);

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
        name: 'seekingVolunteers',
        label: 'Needs volunteers',
        sort: { order: 'desc' }
      }
    ],
    statusOptions,
  })

  // Map event handlers

  // show popup on click
  map.on('click', 'locations', function (e) {
    updatePopup(e.features[0]);
  });

  // set pointer cursor when hovering over clickable point
  map.on('mouseenter', 'locations', function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  // clear pointer cursor when not hovering over clickable point
  map.on('mouseleave', 'locations', function () {
    map.getCanvas().style.cursor = '';
  });
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
