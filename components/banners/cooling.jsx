import React, { useContext, useState } from "react";
import { LanguageContext } from "@contexts/translator";

import styles from "./hours.module.css";


const CoolingBanner = () => {
  const { getTranslation } = useContext(LanguageContext);
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div id="cooling-banner" className={styles["cooling-banner"]}>
      <div className={styles["cooling-message"]}>
        <i className={`material-icons-round`} alt="hours banner">wb_sunny</i>
        <p>{getTranslation("its_hot_out")}</p>
        <a className={styles["county-link"]} href="https://www.hennepin.us/cool" target="_blank" rel="noopener noreferrer">
          <i className={`material-icons-round`} alt="double arrow icon">double_arrow</i>
          <p>{getTranslation("hennepin")}</p>
        </a>
        <a className={styles["county-link"]} href="https://ramseygis.maps.arcgis.com/apps/View/index.html?appid=6279e4532ebb4fcfbdd8d65fd706a678" target="_blank" rel="noopener noreferrer">
          <i className={`material-icons-round`} alt="double arrow icon">double_arrow</i>
          <p>{getTranslation("ramsey")}</p>
        </a>
      </div>  
      <div
        id="close-cooling-banner-button"
        className={styles["close-banner"]}
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

export default CoolingBanner;
