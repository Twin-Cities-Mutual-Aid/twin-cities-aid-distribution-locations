/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

import styles from "./card.module.css";

const LocationCard = ({
  closePopups,
  index,
  location,
  mapObject,
  toggleLocationList,
}) => {
  const [onClick, setOnClick] = useState(null);

  useEffect(() => {
    if (location.marker && !onClick) {
      /** The reason we have double-arrow-function action going on here
       * is because we're setting the `onClick` state variable to be a function.
       *
       * Source https://stackoverflow.com/a/55621325 */
      setOnClick(() => () => {
        const popup = location.marker.getPopup();
        if (!popup.isOpen()) {
          // By including an index, we close every popup *except*
          // for the one at the specified index.
          closePopups(index);
          toggleLocationList();
          mapObject.jumpTo({
            center: popup.getLngLat(),
            essential: true,
            zoom: 13,
          });
        } else closePopups();
      });
      // NOTE: Sometimes clicking the card doesn't open popup - not sure if that's since I made changes or from before too
    }
  }, [
    closePopups,
    index,
    location.marker,
    mapObject,
    onClick,
    toggleLocationList,
  ]);

  /** @todo
   * - Populate card-badge-group class with content
   */

  return (
    <div className={`${styles.card} location-list--item`} onClick={onClick}>
      <div className={styles["card-content"]}>
        <div className={styles["card-title"]}>
          {/* Kanad note: got rid of the weird `id` span and set the title to be the status label */}
          <span
            title={location.status.label}
            className={styles["card-status-indicator"]}
            style={{ backgroundColor: location.status.accessibleColor }}
          ></span>
          <h2 className="name">{location.name}</h2>
        </div>
        {location.neighborhood && (
          <h3 className={`${styles["card-subtitle"]} neighborhood`}>
            {location.neighborhood}
          </h3>
        )}
        <div className={styles["card-badge-group"]}>
          {/* ${openingSoonForDistribution}${openingSoonForReceiving}$
            {urgentNeed}${seekingVolunteers}${seekingMoney}${noIdNeeded}$
            {warmingSite}${hiddenSearch}${covid19Testing} */}
        </div>
      </div>
      <div
        className={styles["card-status-border"]}
        style={{ backgroundColor: location.status.accessibleColor }}
      ></div>
    </div>
  );
};

export default LocationCard;
