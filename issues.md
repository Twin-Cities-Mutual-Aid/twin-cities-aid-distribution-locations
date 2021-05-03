# TODO/Issues

## Preexisting Issues
- [ ] Running `snowpack` yields a bunch of new package updates, including some that haven't been built
- [ ] ESLint issues (ignoring style for now)
- [ ] Node version is out of date
- [ ] Get rid of Moment.js, lodash

## New Issues (i.e. as a result of my changes)
- [x] Figure out how to re-render active popup with correct language if language changes
    - Update: Re-rendered entire map when language changes... feels clunkier than before, but it's a very specific use-case I guess?
    - Another update: I broke this lol not sure how :sob:
    - Yet **another** update: I figured out a solution that both adheres to the React Rules of Hooks™ and also doesn't do a full map reload! 🎉 I just had to separate the hooks that initialized the map and the hook that sets the active popup's HTML content.
- [x] Figure out how to umount popup component from DOM when unselected
    - Update: just rendered popup as static markup rather than React DOM component... not ideal but whatever
- [x] Figure out this weird error, which happens every time I click from one item to another in the location list
    - It might be that the popup objects are being modified/removed improperly?
    - Update: figured it out! I had to move the `activeLocation` state to the top-level main component, and refactor the `closePopup()` logic.
```
Warning: Cannot update a component (`Mapbox`) while rendering a different component (`Main`). To locate the bad setState() call inside `Main`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
    at Main (webpack-internal:///./components/main.jsx:39:3)
    at TranslatorContext (webpack-internal:///./contexts/translator.jsx:59:3)
    at HomePage (webpack-internal:///./pages/index.jsx:16:3)
```
- [ ] Figure out why switching languages doesn't switch language of active popup in certain situations... still need to figure out concrete reproduction steps on this one

## TODO (before merge):
- [x] Add the react hooks ESLint config
- [ ] Rename banner files per [this comment](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/pull/302#discussion_r624758043)
- [ ] Rename Location List Item file to `LocationCard` per [this comment](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/pull/302#discussion_r624776866)
- [ ] Make sure the popup content is identical to production (currently missing Currently Open For Distributing/Receiving)
- [ ] Filters/search logic
- [ ] Migrate off of `moment`, re-implement "Last Updated At" and datetime parsing
    - Maybe [timeago](https://www.npmjs.com/package/timeago.js) for "Last Updated At"?
- [ ] Re-enable all the ESLint issues I disabled
- [ ] Rip out all the data-translation-ids that are properly translated
    - Ugh and also figure out the 'kar' language font-family override defined in translator.css
- [ ] Make sure that [font optimization](https://github.com/vercel/next.js/blob/canary/docs/basic-features/font-optimization.md) is working properly (I don’t think it is…)

## TODO (after merge):
- [ ] Revisit url parsing/regexing ([comment](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/pull/302#discussion_r624588776))
- [ ] Redo [popup rendering](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/pull/302#discussion_r624563359)
- [ ] Make help page close button consistent ([comment](https://github.com/Twin-Cities-Mutual-Aid/twin-cities-aid-distribution-locations/pull/302#discussion_r624558929))
- [ ] Look into large list rendering (i.e. [windowing](https://web.dev/virtualize-long-lists-react-window))
- [ ] Change h tag in PublicTransit (i.e. these [bad boys](https://github.com/kanadgupta/twin-cities-aid-distribution-locations/blob/fdd719ceaaacfcceaa3e7789b2ef4ac7b16f5f54/components/location/popup.jsx#L134-L140))
- [ ] GeoJSON generation for passing in markers (apparently [our approach is good for fewer than... 20 markers](https://docs.mapbox.com/help/getting-started/add-markers/#approach-2-adding-markers-on-top-of-a-map) haha)