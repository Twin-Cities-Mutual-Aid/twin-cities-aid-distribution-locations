/* eslint-disable react/prop-types */
import React, { useContext } from "react";

import { LanguageContext } from "@contexts/translator";

const LocationListToggle = ({ showLocationList, toggleLocationList }) => {
  const { getTranslation } = useContext(LanguageContext);

  const label = getTranslation(
    showLocationList ? "hide_list_button" : "show_list_button"
  );

  return (
    <button
      id="locations-toggle-button"
      className="location-list-toggle toggle-button"
      onClick={() => toggleLocationList()}
    >
      {label}
    </button>
  );
};

export default LocationListToggle;
