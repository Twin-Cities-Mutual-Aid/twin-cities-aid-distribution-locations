import React, { useContext, useState } from "react";
import dynamic from "next/dynamic";

import CovidBanner from "@components/banners/covid";
import HoursBanner from "@components/banners/hours";
import HelpToggle from "@components/buttons/help";
import LocationListToggle from "@components/buttons/location";
import Help from "@components/help";
import LocationList from "@components/locationList";
import SEO from "@components/seo";
import Welcome from "@components/welcome";

import useLocation from "@hooks/useLocation";

const Mapbox = dynamic(() => import("@components/mapbox"), {
  // eslint-disable-next-line react/display-name
  loading: () => <p>Loading map...</p>,
  ssr: false,
});

import { LanguageContext } from "@contexts/translator";

// eslint-disable-next-line react/prop-types
const Main = ({ initialLocations }) => {
  const { getTranslation, setWelcome, showWelcome } = useContext(
    LanguageContext
  );

  const [mapObject, setMapObject] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const toggleHelp = () => setShowHelp((prevHelp) => !prevHelp);

  // Only used for smaller width screens, hence we're not using this to hide the LocationList component
  // It might be worth refactoring at some point, but not right now
  const [showLocationList, setShowLocationList] = useState(false);
  const toggleLocationList = () =>
    setShowLocationList((prevLocationList) => !prevLocationList);

  const { closePopups, locations, dispatchLocation } = useLocation(
    initialLocations
  );

  return (
    <>
      <SEO />
      <div id="skiptocontent">
        <a href="#main-content">skip to main content</a>
      </div>

      <CovidBanner />
      <HoursBanner />
      <div
        className={["main-content", showLocationList ? "list-active" : ""].join(
          " "
        )}
        id="main-content"
      >
        <div className="content">
          <div id="header">
            <div className="title white-and-blue">
              <h1
                // data-translation-id="page_title"
                className="h1"
              >
                {getTranslation("page_title")}
              </h1>
            </div>
            <div className="filter-pane white-and-blue">
              <div className="legend" id="key"></div>
              <LocationListToggle
                showLocationList={showLocationList}
                toggleLocationList={toggleLocationList}
              />
              <HelpToggle toggleHelp={toggleHelp} />
            </div>
            <div id="search-controls"></div>
          </div>
          {/* This is so there isn't so much jumpiness when the map loads. Need to figure out if this is the best place for this! */}
          {isMapLoaded && (
            <div id="side-pane" className="location-list">
              <div id="filter-controls"></div>
              <LocationList
                closePopups={closePopups}
                locations={locations}
                mapObject={mapObject}
                toggleLocationList={toggleLocationList}
              />
            </div>
          )}
        </div>
        {showHelp && <Help close={() => setShowHelp(false)} />}
        {/** Mapbox is an expensive component to re-render,
         * so we're going to set a top-level `display` property to show/hide it.
         */}
        <Mapbox
          activeLocation={activeLocation}
          display={!showHelp}
          locations={locations}
          mapObject={mapObject}
          setActiveLocation={setActiveLocation}
          setIsMapLoaded={setIsMapLoaded}
          dispatchLocation={dispatchLocation}
          setMapObject={setMapObject}
        />
      </div>
      {showWelcome && (
        <Welcome
          onSelect={(lang) => {
            // We should do a lot of shit here, like updating the translator object, updating moment, etc.
            console.log("lang has been set to", lang);
            setWelcome(false);
          }}
        />
      )}
    </>
  );
};

export default Main;
