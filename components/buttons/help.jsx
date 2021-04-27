/* eslint-disable react/prop-types */
import React, { useContext } from "react";

import { LanguageContext } from "@contexts/translator";

const HelpToggle = ({ toggleHelp }) => {
  const { getTranslation } = useContext(LanguageContext);

  const label = getTranslation("help_info");

  return (
    <button
      // data-translation-id="help_info"
      id="help-info-toggle-button"
      className="toggle-button"
      // TODO: do we need an aria label here if the inner text is already set?
      aria-label={label}
      onClick={() => toggleHelp()}
    >
      {label}
    </button>
  );
};

export default HelpToggle;
