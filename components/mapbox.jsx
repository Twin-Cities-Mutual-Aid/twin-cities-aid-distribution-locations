/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { LanguageContext } from "@contexts/translator";
import Popup from "@components/location/popup";

import mapboxgl from "mapbox-gl";

// TODO: add `process` to the .eslintrc
// eslint-disable-next-line no-undef
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOXGL_ACCESS_TOKEN;

const Mapbox = ({
  activeLocation,
  display,
  locations,
  mapObject,
  setActiveLocation,
  setIsMapLoaded,
  dispatchLocation,
  setMapObject,
}) => {
  const { getTranslation, language, setWelcome } = useContext(LanguageContext);
  const mapContainerRef = useRef(null);

  // Set the HTML for the current popup
  useEffect(() => {
    if (activeLocation) {
      const html = ReactDOMServer.renderToStaticMarkup(
        <div className="popup-content">
          {/** We need to pass the language context stuff in as props here because
           * ReactDOM and ReactDOMServer don't preserve context. Gross, I know.
           *
           * TODO: maybe we can initialize these Popup components somewhere else so we don't have to render them in the browser?
           * Maybe we don't need to pass in context variables then? (sigh) */}
          <Popup
            getTranslation={getTranslation}
            language={language}
            location={activeLocation}
          />
        </div>
      );
      activeLocation.marker.getPopup().setHTML(html);
    }
  }, [activeLocation, getTranslation, language]);

  // For initializing map
  useEffect(() => {
    // Inspired by: https://dev.to/justincy/using-mapbox-gl-in-react-d2n
    if (mapContainerRef.current && !mapObject) {
      // Alternative base style: 'mapbox://styles/mapbox/light-v10',
      // See also: https://docs.mapbox.com/mapbox-gl-js/example/setstyle/
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/saman/ckawvg6bk011x1ipepu7nqlbh",
        zoom: 10,
        center: [-93.212471, 44.934473],
      });

      map.setPadding({ top: 300, bottom: 20, left: 20, right: 20 });

      // Add zoom and rotate controls
      map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        "bottom-right"
      );

      const onMapLoad = () => {
        locations.forEach((location, index) => {
          // create marker
          const { status } = location;
          location.marker = new mapboxgl.Marker({
            color: status.accessibleColor,
          })
            .setLngLat([location.longitude, location.latitude])
            .setPopup(new mapboxgl.Popup().setMaxWidth("275px"))
            .addTo(map);

          location.marker.getElement().className += " status-" + status.name;

          location.marker
            .getPopup()
            .on("open", () => setActiveLocation(location));

          location.marker.getPopup().on("close", () => setActiveLocation(null));

          dispatchLocation({ location, index });
        });
        setIsMapLoaded(true);
      };

      map.on("load", onMapLoad);

      setMapObject(map);
    }
  }, [
    locations,
    mapObject,
    setActiveLocation,
    setIsMapLoaded,
    dispatchLocation,
    setMapObject,
  ]);

  return (
    <div
      className="map"
      id="map"
      ref={mapContainerRef}
      style={{ display: display ? "block" : "none" }}
    >
      {/* TODO: remove this counter component */}
      <div className="counter">
        <script
          type="text/javascript"
          src="//counter.websiteout.net/js/7/0/41000/0"
        ></script>
      </div>
      <button
        className="lang-select-button"
        id="lang-select-button"
        onClick={() => setWelcome(true)}
      >
        <span className="lang-select-label" data-translation-id="language">
          Language
        </span>
        <span className="lang-current">
          <img
            data-translation-flag
            className="lang-globe lang-globe-current"
            alt=""
            src="/images/lang-all-black.png"
          />
          <span
            className="lang-name"
            // data-translation-id="lang_name"
          >
            {getTranslation("lang_name")}
          </span>
        </span>
      </button>
    </div>
  );
};

export default Mapbox;
