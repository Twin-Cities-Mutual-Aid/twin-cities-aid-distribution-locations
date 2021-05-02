# Twin Cities Aid Distribution Locations

A webapp to coordinate aid and care in the Twin Cities. https://twin-cities-mutual-aid.org/

## About the project

This project is only a few months old, and things continue to change and develop. We'll do our best to keep this readme up-to-date, but if something doesn't look right, it may be out of date. Feel free to ask about it!

This project is unusual because there are two separate teams working in tandem:

* **Website team**: This team (us) is using a channel within the Open Twin Cities slack to communicate. There's a link at the top of the [Open Twin Cities](https://www.opentwincities.org) website to join, if you'd like to help out.
* **[Twin Cities Mutual Aid Project](http://www.tcmap.org)**: TCMAP is a collective, all-volunteeer effort that works to coordinate with aid sites and manage the data that feeds the site on a day-to-day basis. Over 100 volunteers have now been involved in the project. Leadership and tech-oriented volunteers from TCMAP coordinate with stakeholders to source designs, product direction, feature requests and feedback that drive development. TCMAP spawned from a large Facebook group called [South Minneapolis Mutual Aid Autonomous Zone Coordination](https://www.facebook.com/groups/southsidemutualaid) that emerged in the wake of the uprisings in Minneapolis in May 2020.

**Participation is welcome both on the web team and TCMAP sides of this project**. Some developers have engaged through Github and the Open Twin Cities Slack channel alone; others have joined TCMAP to help coordinate efforts, or just to better understand use cases. You can join TCMAP through the [volunteer page on their website](http://www.tcmap.org/volunteer).

## Feature requests & feedback

We're using [Github Issues](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/issues) to manage tasks, and have a [kanban board](https://github.com/orgs/Twin-Cities-Mutual-Aid/projects/1) set up. If you'd like access to the kanban board reach out in the [OTC slack channel](https://otc-slackin.herokuapp.com/).

If you've got a feature request or feedback to share on the website, feel free to [submit an issue](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/issues/new) on GH issues, or bring it up in slack.

## Contributions

If you're ready to start contributing:

1. Reach out to **#tc-aid-dev** channel in the Open Twin Cities Slack or **#dragon-riders** channel in Twin Cities Mutual Aid Project Slack and ask to be added to the **Developers** team for the Twin-Cities-Mutual-Aid Github organization. This will give you access to create branches and push to a clone of the twin-cities-aid-distribution-locations repo and will give you read access to the [secrets](https://github.com/Twin-Cities-Mutual-Aid/secrets) repo for local environment variables.
2. Clone down the repo - be sure to clone and not fork. Our current CI/CD solution (TravisCI) cannot inject environment variables to forks so any PRs submitted from a fork will have failing tests.
3. Take a look at the Kanban board, assign yourself to an issue, and pull it into **In Progress**. Issues on the Kanban board tagged with **Ready To Go** or **Good First Issue** are good ones to start with.
4. Create a branch following the format `issue-<issue#>/<github-username>/<short-description-of-work>`.
5. Code to your heart's content!
6. Reach out to either slack channel listed above for any questions.
7. When you are ready for review, submit a pull request and tag anyone from the **Approvers** team to review.
8. When your code has been approved, squash & merge the code.

## Data

Data is sourced from an Airtable database through the tcmap-api backend.

* [Public TCMAP Airtable Data](https://airtable.com/shr2el3WSJHLNgQUx/tblGDXjVZuA2GejcN)

## Additional Documentation

* Information about adding, editing and maintaining languages can be found in [Language Translation](docs/LANGUAGE_TRANSLATION.md)

## About the application

This started as a very lightweight, single page html file, and we've tried very hard to keep things as simple as possible.

### Setup

Two options currently:

Build Local

1. Install [node](https://nodejs.org/) at the version specified in the [`.node-version`](.node-version) file. If you use a version manager like [nodenv](https://github.com/nodenv/nodenv) or [nvm](https://github.com/nvm-sh/nvm), this should be detected automatically.
2. Install dependencies with npm

    ```bash
        npm install
    ```

3. Configure [environment variables](#environment-variables)
4. Build and run the application with npm

    ```bash
    npm run dev
    ```

### Environment Variables

The application uses [environmental variables](https://en.wikipedia.org/wiki/Environment_variable) to manage configuration between environments. These values are set in a `.env` file in the project root directory. 

To set up a `.env`, copy the `.env.example` file, which lists needed configuration values. For example, in the Mac OS terminal:

```bash
cp .env.example .env
```

A set variable in the `.env` file will look like this:

```env
SNOWPACK_PUBLIC_MAPBOXGL_ACCESS_TOKEN=1234
```

If you're a member of the Twin Cities Mutual Aid organization you can find the default values for the local development `env` file here:

https://github.com/Twin-Cities-Mutual-Aid/secrets/blob/master/.env

If not, you can ask for the most recent values of the configuration values from the Open Twin Cities slack `#tc-aid-dev` channel.

If you need to introduce a new environmental variable, please coordinate with developers in the `#tc-aid-dev` channel, add it to the `.env.example` file, and note it in your pull request.

### Run locally

To run a development server that will auto-reload on save, run this command from the project directory:

```bash
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

## Code of Conduct

Contributors to the project are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
