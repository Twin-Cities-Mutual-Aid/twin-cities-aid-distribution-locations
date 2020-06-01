const $locationList = document.getElementById('location-list')
const $sidePane = document.getElementById('side-pane')

const statusMap = [
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
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 10,
  center: [-93.212471, 44.934473]
})


function camelToTitle(str) {
  const result = str.replace(/([A-Z])/g,' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

function toggleSidePane($burger) {
  if ($sidePane.classList.contains('active')) {
    $sidePane.classList.remove('active')
  } else {
    $sidePane.classList.add('active')
  }
}

function closePopups() {
  locations.forEach(location => {
    location.marker.getPopup().remove()
  })
}


const getStatus = id => _.find(statusMap, s => (s.id === id))

const onMapLoad = async () => {
  const resp = await fetch(DATA_URL)
  const data = await resp.json()



  locations = _.chain(data.feed.entry)
    .filter(item => (item.gsx$nameoforganization.$t != '') && (item.gsx$longitude.$t != '') && (item.gsx$latitude.$t != '')) // only items with names and lon,lat
    .sortBy(item => item.gsx$nameoforganization.$t )
    .map(item => {
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
        urgentNeed: item.gsx$urgentneed.$t,
        notes: item.gsx$notes.$t,
        mostRecentlyUpdatedAt: item.gsx$mostrecentlyupdated.$t,
      }

      const location = _.pickBy(rawLocation, val => val != '')

      const propertyTransforms = {
        name: (name) => `<h1>${name}</h1>`,
        neighborhood: (neighborhood) => `<h2>${neighborhood}</h2>`,
        address: (address) => `<h3><a href="https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(address)}" target="_blank">${address}</a></h3>`, // driving directions in google, consider doing inside mapbox
      }

      // const accessibleColorTransform = { // this way you don't have to change everything in the google spreadsheet
      //   "#fc03df": "#2c7bb6",
      //   "#03bafc": "#abd9e9",
      //   "#9f48ea": "#fdae61",
      //   "#c70000": "#d7191c",
      //   "#aaaaaa": "#ffffbf"
      // }
      const status = getStatus(item.gsx$color.$t)


      const markerHtml = _.map(location, (value, key) => {
        if (propertyTransforms[key]) return propertyTransforms[key](value)
        else return `<div><strong>${camelToTitle(key)}: </strong>${value}</div>`
      }).join('')

      location.marker = new mapboxgl.Marker({ color: status.accessibleColor })
        .setLngLat([ parseFloat(item.gsx$longitude.$t), parseFloat(item.gsx$latitude.$t) ])
        .setPopup(new mapboxgl.Popup().setMaxWidth('250px').setHTML(markerHtml))
        .addTo(map);

      const urgentNeed = location.urgentNeed ? `<h3 style="color: #f00; font-size: 80%">Urgent Need: ${location.urgentNeed}</h3>` : ''
      const $item = document.createElement('div')
      $item.classList.add('card')
      $item.innerHTML = `
        <div class="container">
          <h2 style="color: #444; font-size: 120%">
          <span class="indicator" style="background-color: ${status.accessibleColor}; margin-right: 10px"></span>
          ${location.name}
          </h2>
          <h3 color: #aaa; font-size: 80%>${location.neighborhood}</h3>
          ${urgentNeed}
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
            center: [ parseFloat(item.gsx$longitude.$t), parseFloat(item.gsx$latitude.$t) ],
            essential: true,
            zoom: 13
          })
        }
      })
      $locationList.appendChild($item)

      return location
    })
    .value()

    map.addControl(new mapboxgl.NavigationControl());
}


// map.on('load', function() {
//   fetch(DATA_URL)
//     .then(response => response.json())
//     .then(data => {
//       locations = _.chain(data.feed.entry)
//         .filter(item => (item.gsx$nameoforganization.$t != '') && (item.gsx$longitude.$t != '') && (item.gsx$latitude.$t != '')) // only items with names and lon,lat
//         .sortBy(item => item.gsx$nameoforganization.$t )
//         .map(item => {
//           const rawLocation = {
//             name: item.gsx$nameoforganization.$t,
//             neighborhood: item.gsx$neighborhood.$t,
//             address: item.gsx$addresswithlink.$t,
//             currentlyOpenForDistributing: item.gsx$currentlyopenfordistributing.$t,
//             openingForDistributingDontations: item.gsx$openingfordistributingdonations.$t,
//             closingForDistributingDonations: item.gsx$closingfordistributingdonations.$t,
//             accepting: item.gsx$accepting.$t,
//             notAccepting: item.gsx$notaccepting.$t,
//             currentlyOpenForReceiving: item.gsx$currentlyopenforreceiving.$t,
//             openingForReceivingDontations: item.gsx$openingforreceivingdonations.$t,
//             closingForReceivingDonations: item.gsx$closingforreceivingdonations.$t,
//             seekingVolunteers: item.gsx$seekingvolunteers.$t,
//             urgentNeed: item.gsx$urgentneed.$t,
//             notes: item.gsx$notes.$t,
//             mostRecentlyUpdatedAt: item.gsx$mostrecentlyupdated.$t,
//           }

//           const location = _.pickBy(rawLocation, val => val != '')

//           const propertyTransforms = {
//             name: (name) => `<h1>${name}</h1>`,
//             neighborhood: (neighborhood) => `<h2>${neighborhood}</h2>`,
//             address: (address) => `<h3><a href="https://maps.google.com?saddr=Current+Location&daddr=${encodeURI(address)}" target="_blank">${address}</a></h3>`, // driving directions in google, consider doing inside mapbox
//           }

//           const accessibleColorTransform = { // this way you don't have to change everything in the google spreadsheet
//             "#fc03df": "#2c7bb6",
//             "#03bafc": "#abd9e9",
//             "#9f48ea": "#fdae61",
//             "#c70000": "#d7191c",
//             "#aaaaaa": "#ffffbf"
//           }

//           const markerHtml = _.map(location, (value, key) => {
//             if (propertyTransforms[key]) return propertyTransforms[key](value)
//             else return `<div><strong>${camelToTitle(key)}: </strong>${value}</div>`
//           }).join('')

//           location.marker = new mapboxgl.Marker({ color: accessibleColorTransform[item.gsx$color.$t] })
//             .setLngLat([ parseFloat(item.gsx$longitude.$t), parseFloat(item.gsx$latitude.$t) ])
//             .setPopup(new mapboxgl.Popup().setMaxWidth('250px').setHTML(markerHtml))
//             .addTo(map);

//           const urgentNeed = location.urgentNeed ? `<h3 style="color: #f00; font-size: 80%">Urgent Need: ${location.urgentNeed}</h3>` : ''
//           const $item = document.createElement('div')
//           $item.classList.add('card')
//           $item.innerHTML = `
//             <div class="container">
//               <h2 style="color: #444; font-size: 120%">
//               <span class="indicator" style="background-color: ${accessibleColorTransform[item.gsx$color.$t]}; margin-right: 10px"></span>
//               ${location.name}
//               </h2>
//               <h3 color: #aaa; font-size: 80%>${location.neighborhood}</h3>
//               ${urgentNeed}
//             </div>
//           `
//           $item.addEventListener('click', (evt) => {
//             const popup = location.marker.getPopup()
//             if (popup.isOpen()) {
//               popup.remove()
//             } else {
//               closePopups()
//               $sidePane.classList.remove('active')
//               popup.addTo(map)
//               map.flyTo({
//                 center: [ parseFloat(item.gsx$longitude.$t), parseFloat(item.gsx$latitude.$t) ],
//                 essential: true,
//                 zoom: 13
//               })
//             }
//           })
//           $locationList.appendChild($item)

//           return location
//         })
//         .value()
//     })
// })

map.on('load', onMapLoad)
map.addControl(new mapboxgl.NavigationControl());