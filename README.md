# Twin Cities Aid Distribution Locations
A webapp to coordinate aid and care in the Twin Cities. https://twin-cities-mutual-aid.org/

## About the project
This project is only a few days old, and things are changing very rapidly. We'll do our best to keep this readme up-to-date, but if something doesn't look right, it's probably out of date.

This project is unusual because there are two separate, siloed teams working in tandem:

* **Website team**: This team (us) is using a channel within the Open Twin Cities slack to communicate. There's a link at the top of the [Open Twin Cities](https://www.opentwincities.org) website to join, if you'd like to help out.
* **Data team**: The team working on updating the underlying data to ensure the real-time info is up-to-date is partly coordinated via a very large Facebook group called [South Minneapolis Mutual Aid Autonomous Zone Coordination](https://www.facebook.com/groups/southsidemutualaid). We don't have much more information at this time, but will update this when we do.

## Feature requests & feedback
We're using [Github Issues](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/issues) to manage tasks, and have a [kanban board](https://github.com/orgs/Twin-Cities-Mutual-Aid/projects/1) set up. If you'd like access to the kanban board reach out in the [OTC slack channel](https://otc-slackin.herokuapp.com/).

If you've got a feature request or feedback to share on the website, feel free to submit an issue on GH issues, or bring it up in slack.

## Data

Data is sourced from a google spreadsheet.
* Example spreadsheet: https://docs.google.com/spreadsheets/d/1ETV6xakGCkp3dmgfpayjEBQii8p_ElMXYuDut3EDZTE/edit#gid=0
* Google Apps Script utility script also available to automatically update a row timestamp and insert latitude and longitude when an address cell is added or updated: https://github.com/mc-funk/community-map-google-scripts/

To test locally with your own copy of the spreadsheet, duplicate the example
spreadsheet, make your changes, and re-publish it. Then follow the steps
https://www.freecodecamp.org/news/cjn-google-sheets-as-json-endpoint to
extract the sheet ID out of the url to plug into the DATA_URL const.

`
  const DATA_URL = 'https://spreadsheets.google.com/feeds/list/1XJhbzcT_AubgnqAJRsbOEbMO3HPTybG3yNcX6i-BgH0/1/public/full?alt=json'
`

## About the application
This started as a very lightweight, single page html file, and we've tried very hard to keep things as simple as possible.

### Setup

To get started, you have to install the dependencies (mainly snowpack)

```
npm install
```

### Run locally

To run a development server that will auto-reload on save, run this command from the project directory:

```
npm run dev
```

A server will run on http://localhost:8080

## Adding things

### Adding A Dependency

1. Add your dependency with `npm install --save <dep>`
2. Use your dependency with `import <whatever> from '<dep>'`
3. Run `npm run snowpack install` to vendor the dependency

### Adding Stylesheets

#### From a dependency

1. Import the sheet from the dist folder like `import '<dep>/dist/stylesheet.css`
2. That's it.

#### From a new Source file

1. Create a stylesheet in `src/styles`
2. Import the sheet either in the index or from whatever js file the styles apply to.

### Adding an Image

Images go in `public/images` and will be served under `<url>/images/image_name.whatever`

### Any other static file

If you need to add some other kind of static file, it should go somewhere in the public folder.

### Maki Icons
https://labs.mapbox.com/maki-icons/
