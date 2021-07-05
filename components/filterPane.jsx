import React, { useContext, useEffect, useState } from "react";
import Filter from "@components/filter";
import { LocationsContext } from "@contexts/locations"
import styles from "./filter.module.css"
import useLocation from "@hooks/useLocation";

// May just break this fully into search, filter, sort components 
const FilterPane = ({
  // Think can remove this
  initialLocations,
}) => {
  // Everything to do with search in here is a mess and not usable, also lots of remnants from trying to use the useLocation hook - still need to clean that up
  const [searchTerm, setSearchTerm] = useState('')
  // const { filterResults } = useLocation(initialLocations);


  const onChange = (e, { value }) => {

    const searchText = value.trim().replace(/" "/g, "")

    searchSites(searchText)(dispatch)
  }

  const { updateFilter, filteredLocations } = useContext(LocationsContext)
  
  const [locationCount, setLocationCount] = useState(filteredLocations?.length)

  useEffect(() => {
    setLocationCount(filteredLocations?.length)
  }, [filteredLocations])

  const handleFilters = (filters, category) => {
    // Might not need this category stuff
    const newFilters = {...filters}
    
    newFilters[category] = filters

    updateFilter(newFilters)
    // filterResults(filteredLocations)
  }




  return (
    <>
      <div className="filter-pane white-and-blue">
        <Filter className={styles["white-and-blue"]} handleFilters={filters => handleFilters(filters, "statuses")} />
        <div className="legend" id="key"></div>

        {/* <form id="search-form" role="search" className="search-container" action="javascript:void(0);"> */}
      </div>
      <form id="search-form" role="search" className="search-container">
        <div className="search-input-group search-full-width">
          {/* <label for="search">
            <span className="sr-only">Type here to search sites or needs</span>
          </label> */}
          <img className="search-icon" src='images/icon_search.svg' alt='search icon'/>
          
          <input type="text" className="search-input" id="search" placeholder="Search sites or needs..." data-translation-id="search" value={searchTerm}
  onChange={event => setSearchTerm(event.target.value)} />
          {searchTerm}
          <img id="clear-search-btn" className="hide-clear-search" data-translation-id="search_clear" src='images/icon_clear_search.svg' alt='clear search button'/>
        </div>
      </form>
      <div className="list-meta">
        <div className="list-results">
          <span id="list-results-count">{locationCount} </span> 
          <span data-translation-id="list_results">results</span>
        </div>
      </div>
    </>
  );
};

export default FilterPane;