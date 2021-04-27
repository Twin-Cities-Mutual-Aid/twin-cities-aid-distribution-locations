/* eslint-disable no-unused-vars, react/prop-types */
import React, { useContext, useEffect, useState } from "react";

import ListItem from "@components/location/listItem";

import { LanguageContext } from "@contexts/translator";

const LocationList = ({
  closePopups,
  locations,
  mapObject,
  toggleLocationList,
}) => {
  const { getTranslation, language, setWelcome } = useContext(LanguageContext);

  /** @todo
   * - Add a useEffect hook that adds onClick handlers to open the location popup
   * - Populate card-badge-group class with content
   */

  return (
    <div className="list" id="location-list">
      {locations.map((location, i) => (
        <ListItem
          key={`location-${location.name}-${i}`}
          closePopups={closePopups}
          index={i}
          location={location}
          mapObject={mapObject}
          toggleLocationList={toggleLocationList}
        />
      ))}
    </div>
  );
};

export default LocationList;
