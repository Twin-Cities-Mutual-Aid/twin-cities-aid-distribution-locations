import React, { useState } from "react";

import styles from "./hours.module.css";

const CoolingBanner = () => {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div id="cooling-banner" className={styles["cooling-banner"]}>
      <div className={styles["cooling-message"]}>
        <p className={styles["due-to-holiday"]}>
          TCMAP is on hiatus.{" "}
        </p>

      </div>
      <div
        id="close-cooling-banner-button"
        className={styles["close-cooling-banner"]}
        onClick={() => setHidden(true)}
      >
        <i
          className={`material-icons-round ${styles["close-icon"]}`}
          alt="close cooling banner"
        >
          close
        </i>
      </div>
    </div>
  );
};

export default HoursBanner;
