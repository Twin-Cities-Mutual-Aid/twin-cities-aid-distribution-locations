# Twin Cities Aid Distribution Locations
A webapp to coordinate aid and care in the Twin Cities. https://twin-cities-mutual-aid.org/

## About the project
This project is only a few days old, and things are changing very rapidly. We'll do our best to keep this readme up-to-date, but if something doesn't look right, it's probably out of date.

This project is unusual because there are two separate, siloed teams working in tandem:

* **Website team**: This team (us) is using a channel within the Open Twin Cities slack to communicate. There's a link at the top of the [Open Twin Cities](opentwincities.org) website to join, if you'd like to help out.
* **Data team**: The team working on updating the underlying data to ensure the real-time info is up-to-date is partly coordinated via a very large Facebook group called [South Minneapolis Mutual Aid Autonomous Zone Coordination](https://www.facebook.com/groups/southsidemutualaid). We don't have much more information at this time, but will update this when we do.

## Issues & Feature Requests
Wer're using [Github Issues](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/issues) to manage tasks, and have a [kanban board](https://github.com/orgs/Twin-Cities-Mutual-Aid/projects/1) set up.

If you've got a feature request or feedback to share on the website, feel free to submit an issue on GH issues, or bring it up in slack.

## Data

Data is sourced from a google spreadsheet. 
* Example spreadsheet: https://docs.google.com/spreadsheets/d/1IIDsFN-If0IfNrRO-I3WbisHAz7EGjJ8aviSboX_-z4/
* Google Apps Script utility script also available to automatically update a row timestamp and insert latitude and longitude when an address cell is added or updated: https://github.com/mc-funk/community-map-google-scripts/


## About the application
This started as a very lightweight, single page html file, and we've tried very hard to keep things as simple as possible.

### Run locally

To run a development server that will auto-reload on save, run this command from the project directory:

`
npm run dev
`

A server will run on http://localhost:8080

Alternately, you can run `npx http-server`, or install https://www.npmjs.com/package/http-server and run `http-server` (defaulting to port 8080).

### Maki Icons
https://labs.mapbox.com/maki-icons/
