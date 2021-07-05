/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import Image from "next/image";

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
  filter
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

      map.setPadding({ top: 0, bottom: 100, left: 20, right: 20 });

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
        locations && locations.forEach((location, index) => {
          // create marker
          const { status } = location;
          location.marker = new mapboxgl.Marker({
            color: status.accessibleColor,
          })
            .setLngLat([location.longitude, location.latitude])
            .setPopup(new mapboxgl.Popup().setMaxWidth("275px"))
            .addTo(map);

          location.marker.getElement().className += " status-" + status.name;

          location.marker.getPopup().on("open", () => {
            setActiveLocation(location);
            map.flyTo({
              center: [location.longitude, location.latitude],
            });
          });

          location.marker.getPopup().on("close", () => setActiveLocation(null));
          // Might not need this
          // dispatchLocation({ location, index });
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

  useEffect(() => {
    // Repeating this list all over the place right now - need to put in central location (also not sure about count yet)
    const statusList = [
      {
        id: 0,
        name: "receiving",
        label: "open for receiving donations",
        accessibleColor: "#2c7bb6",
        count: 0,
      },
      {
        id: 1 ,
        name: "distributing",
        label: "open for distributing donations",
        accessibleColor: "#abd9e9",
        count: 0,
      },
      {
        id: 2,
        name: "both",
        label: "open for both",
        accessibleColor: "#fdae61",
        count: 0,
      },
      {
        id: 3,
        name: "closed",
        label: "not open now",
        accessibleColor: "#d7191c",
        count: 0,
      }
    ]


    const { statuses } = filter
    if (statuses) {
      const filteredOutStatuses = statusList.filter(statusOption => !statuses.some((status) => status.id === statusOption.id))
    // Tried updating through onMapLoad but caused whole map object to reload each time. May be a cleaner way to do this than hiding markers but not sure
    if(mapContainerRef.current) {
      filteredOutStatuses.forEach((status) => {
        mapContainerRef.current.classList.add(`hide-${status.name}`)
      })
      statuses.forEach((status) => {
        mapContainerRef.current.classList.remove(`hide-${status.name}`)
      })
    }
  }

  }, [locations, mapObject, filter])

  return (
    <div
      className="map"
      id="map"
      ref={mapContainerRef}
      style={{ display: display ? "block" : "none" }}
    >
      <button
        className="lang-select-button"
        id="lang-select-button"
        onClick={() => setWelcome(true)}
      >
        <Image
          alt=""
          className="lang-globe"
          height={16}
          layout="fixed"
          src="/images/lang-all-black.png"
          width={16}
        />
        <span className="lang-name">{getTranslation("lang_name")}</span>
      </button>
    </div>
  );
};

export default Mapbox;
