import React, { createContext, useEffect, useState } from "react";

const LocationsContext = createContext({});

const LocationsProvider = ({ children }) => {
  // const { closePopups, locations, dispatchLocation, filterResults } = useLocation(initialLocations);

    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([])
    const [filter, setFilter] = useState({});
    // Sorting not working correctly yet
    // const [sortOption, setSortOption] = useState({name: "name", label: "Alphabetical (name)"})
    const [sortOption, setSortOption] = useState("name")

    // const refreshLocations = async () => {
    //   try {
    //       const res = await fetch(
    //           `https://tcmap-api.herokuapp.com/v1/mutual_aid_sites`
    //         )
    //       const latestLocations = await res.json();
    //       setLocations(latestLocations)
    //   } catch (err) {
    //       console.error(err)
    //   }
    // }

    // Moved from useLocation
    const closePopups = (index) => {
      // TODO: Occassionally getting undefined error with location
      filteredLocations?.forEach((location, i) => {
        /**
         * If an index is passed in, we close every popup *except*
         * for the one at the specified index.
         * If there isn't an index passed in, simply close every popup.
         */
        if (
          location.marker.getPopup().isOpen() &&
          (!index || index !== i)
        )
          location.marker.togglePopup();
        /** If an index is passed in and its popup is closed, open it! */
        if (index === i && !location.marker.getPopup().isOpen())
          location.marker.togglePopup();
      });
  
      return filteredLocations;
    }

    useEffect(() => {
      const { statuses } = filter
      let result = locations

      if (statuses) {
        result = result.filter(location => statuses.some((status) => status.id === location.status.id)).sort((a, b) => (a[sortOption] > b[sortOption]) ? 1  : -1 )
        // TODO: Maybe should only happen when filtering happens and not on sort?
        closePopups()
      } else {
        result = result.sort((a, b) => (a[sortOption] > b[sortOption]) ? 1  : -1 )
      }

      setFilteredLocations(result)

    }, [filter, locations, sortOption])

    const updateFilter = filter => {
        setFilter(filter)
    }

    const updateSortOption = option => {
      setSortOption(option)
    }

    return (
      <LocationsContext.Provider 
        value={{ 
          locations, 
          setLocations,
          updateFilter,
          filteredLocations,
          setFilteredLocations,
          filter,
          closePopups,
          sortOption,
          updateSortOption
        }}
      >
        {children}
      </LocationsContext.Provider>
    );
};

export default LocationsProvider
export { LocationsContext }