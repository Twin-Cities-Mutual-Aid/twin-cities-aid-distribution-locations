import React, { useContext, useState } from "react";

import { LanguageContext } from "@contexts/translator";

import styles from "./covid.module.css";

const CovidBanner = () => {
  const [hidden, setHidden] = useState(false);
  const { getTranslation } = useContext(LanguageContext);

  if (hidden) return null;
  return (
    <div id="covid-banner" className={styles["covid-banner"]}>
      <div className={styles["covid-banner-reminder"]}>
        <div className={styles["safety-reminder"]}>
          <i
            className={`material-icons-round ${styles["covid-warning-icon"]}`}
            aria-hidden="true"
          >
            error
          </i>
          <div>
            <a
              className={styles["covid-19"]}
              href="https://www.health.state.mn.us/diseases/coronavirus/index.html"
            >
              {getTranslation("covid_19")}
            </a>
            <p className={styles["safety-reminder-message"]}>
              {getTranslation("safety_reminder")}
            </p>
          </div>
        </div>

        <div className={styles["covid-comply-message"]}>
          <p>{getTranslation("covid_request")}</p>
          <a
            className={styles["learn-more"]}
            href="https://www.health.state.mn.us/diseases/coronavirus/index.html"
          >
            <i className="material-icons-round" alt="double arrow icon">
              double_arrow
            </i>
            <p>{getTranslation("learn_more")}</p>
          </a>
        </div>

        <div className={styles["covid-icon-container"]}>
          <i
            className={`material-icons-round ${styles["covid-icon"]}`}
            alt="mask icon"
          >
            masks
          </i>
          <h5 className={styles["covid-icon-message"]}>
            {getTranslation("wear_masks")}
          </h5>
        </div>
        <div className={styles["covid-icon-container"]}>
          <i
            className={`material-icons-round ${styles["covid-icon"]}`}
            alt="social distance icon"
          >
            6_ft_apart
          </i>
          <h5 className={styles["covid-icon-message"]}>
            {getTranslation("social_distance")}
          </h5>
        </div>
        <div className={styles["covid-icon-container"]}>
          <i
            className={`material-icons-round ${styles["covid-icon"]}`}
            alt="wash hands icon"
          >
            wash
          </i>
          <h5 className={styles["covid-icon-message"]}>
            {getTranslation("wash_hands")}
          </h5>
        </div>
      </div>
      <div
        id="close-covid-banner-button"
        className={styles["close-banner"]}
        onClick={() => setHidden(true)}
      >
        <i
          className={`material-icons-round ${styles["close-icon"]}`}
          alt="close covid banner"
        >
          close
        </i>
      </div>
    </div>
  );
};

export default CovidBanner;
