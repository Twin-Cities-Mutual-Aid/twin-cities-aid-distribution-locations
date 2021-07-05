import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import CovidBanner from "@components/banners/covid";
import HoursBanner from "@components/banners/hours";
import HelpToggle from "@components/buttons/help";
import LocationListToggle from "@components/buttons/location";
import Help from "@components/help";
import LocationList from "@components/locationList";
import SEO from "@components/seo";
import Welcome from "@components/welcome";
import FilterPane from "@components/filterPane";

import useLocation from "@hooks/useLocation";
import { LocationsContext } from "@contexts/locations";
import { LanguageContext } from "@contexts/translator";


const Mapbox = dynamic(() => import("@components/mapbox"), {
  // eslint-disable-next-line react/display-name
  loading: () => (
    <div className="map loading" id="map">
      Loading Mutual Aid Sites...
    </div>
  ),
  ssr: false,
});


// eslint-disable-next-line react/prop-types
const Main = ({ initialLocations }) => {
  const { getTranslation } = useContext(LanguageContext);

  const { filteredLocations, filter, closePopups } = useContext(LocationsContext)



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

  // Might not need this
  const { locations, dispatchLocation, filterResults } = useLocation(initialLocations);


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
              <h1 className="h1">{getTranslation("page_title")}</h1>
            </div>
            <div className="filter-pane white-and-blue">
              <div className="legend" id="key"></div>
              <LocationListToggle
                showLocationList={showLocationList}
                toggleLocationList={toggleLocationList}
              />
              <HelpToggle toggleHelp={toggleHelp} />
            </div>
            <FilterPane initialLocations={filteredLocations} />
            <div id="search-controls"></div>
          </div>
          {/* This is so there isn't so much jumpiness when the map loads. Need to figure out if this is the best place for this! */}
          {isMapLoaded && (
            <div id="side-pane" className="location-list">
              <div id="filter-controls"></div>
              <LocationList
                closePopups={closePopups}
                locations={filteredLocations}
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
          locations={filteredLocations}
          mapObject={mapObject}
          setActiveLocation={setActiveLocation}
          setIsMapLoaded={setIsMapLoaded}
          dispatchLocation={dispatchLocation}
          setMapObject={setMapObject}
          filter={filter}
        />
      </div>
      <Welcome />
    </>
  );
};

export default Main;
