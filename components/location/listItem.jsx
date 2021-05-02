/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const LocationListItem = ({
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
       * is because we're the `onClick` state variable to be a function.
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
    <div className="card location-list--item" onClick={onClick}>
      <div className="card-content">
        <div className="card-title">
          {/* Kanad note: got rid of the weird `id` span and set the title to be the status label */}
          <span
            title={location.status.label}
            className="card-status-indicator"
            style={{ backgroundColor: location.status.accessibleColor }}
          ></span>
          <h2 className="name">{location.name}</h2>
        </div>
        {location.neighborhood && (
          <h3 className="card-subtitle neighborhood">
            {location.neighborhood}
          </h3>
        )}
        {/* <div className="card-badge-group">
            ${openingSoonForDistribution}${openingSoonForReceiving}$
            {urgentNeed}${seekingVolunteers}${seekingMoney}${noIdNeeded}$
            {warmingSite}${hiddenSearch}${covid19Testing}
          </div> */}
      </div>
      <div
        className="card-status-border"
        style={{ backgroundColor: location.status.accessibleColor }}
      ></div>
    </div>
  );
};

export default LocationListItem;
