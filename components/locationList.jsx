/* eslint-disable react/prop-types */
import React from "react";

import LocationCard from "@components/location/card";

const LocationList = ({
  closePopups,
  locations,
  mapObject,
  toggleLocationList,
}) => {

  return (
    <>
    <div className="list" id="location-list">
      {locations && locations.map((location, i) => (
        <LocationCard
          key={`location-${location.name}-${i}`}
          closePopups={closePopups}
          index={i}
          location={location}
          mapObject={mapObject}
          toggleLocationList={toggleLocationList}
        />
      ))}
    </div>
    </>
  );
};

export default LocationList;
