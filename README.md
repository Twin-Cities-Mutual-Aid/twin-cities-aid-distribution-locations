# twin-cities-aid-distribution-locations
A webapp to coordinate aid and care in the Twin Cities.

https://jdalt.github.io/twin-cities-aid-distribution-locations/

Data is sourced from a google spreadsheet. 
* Example spreadsheet: https://docs.google.com/spreadsheets/d/1IIDsFN-If0IfNrRO-I3WbisHAz7EGjJ8aviSboX_-z4/
* Google Apps Script utility script also available to automatically update a row timestamp and insert latitude and longitude when an address cell is added or updated: https://github.com/mc-funk/community-map-google-scripts/

## Run Locally

To run a development server that will auto-reload on save, run this command from the project directory:

`
npm run dev
`

A server will run on http://localhost:8080

Alternately, you can run `npx http-server`, or install https://www.npmjs.com/package/http-server and run `http-server` (defaulting to port 8080).

## Maki Icons
https://labs.mapbox.com/maki-icons/
