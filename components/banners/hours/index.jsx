import React, { useState } from "react";

import styles from "./style.module.css";

const HoursBanner = () => {
  const [hidden, setHidden] = useState(true); // defaulting to true to hide this component
  if (hidden) return null;
  return (
    <div id="hours-banner" className={styles["hiatus-banner"]}>
      <div className={styles["hours-message"]}>
        <i
          className={`material-icons-round ${styles["close-icon"]}`}
          alt="hours banner"
        >
          warning
        </i>
        <h4 className={styles["due-to-holiday"]}>
          TCMAP is on hiatus.{" "}
        </h4>
        <h4>
          &nbsp;Info not up to date March 1 - March 7.
        </h4>
      </div>
      <div
        id="close-hours-banner-button"
        className={styles["close-hours-banner"]}
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

export default HoursBanner;
