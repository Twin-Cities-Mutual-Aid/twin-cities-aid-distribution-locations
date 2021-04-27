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
      // data-translation-id="show_list_button"
      id="locations-toggle-button"
      className="location-list-toggle toggle-button"
      // TODO: do we need an aria label here if the inner text is already set?
      aria-label={label}
      onClick={() => toggleLocationList()}
    >
      {label}
    </button>
  );
};

export default LocationListToggle;
