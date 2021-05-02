/* eslint-disable react/prop-types */
import React, { useContext } from "react";

import { LanguageContext } from "@contexts/translator";

const Welcome = ({ onSelect }) => {
  const { getTranslation, languages, updateLanguage } = useContext(
    LanguageContext
  );
  return (
    <div className="modal-wrap">
      <div className="modal">
        <h1 className="welcome-message">{getTranslation("welcome")}</h1>
        <p>{getTranslation("welcome_blurb")}</p>
        <p className="bold">
          <span>{getTranslation("lang_select")}</span>:
        </p>
        <div className="modal-languages">
          {Object.keys(languages).map((key) => {
            const { lang_name } = languages[key];
            return (
              <button
                key={key}
                className="welcome-lang-button"
                onClick={(e) => {
                  onSelect(e.target.value);
                  updateLanguage(e.target.value);
                }}
                value={key}
              >
                <img
                  alt={lang_name}
                  className="lang-globe-white"
                  src="/images/lang-all-white.png"
                />
                {lang_name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
